from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
import hashlib
import base58
import ecdsa
import binascii
from Crypto.Hash import RIPEMD160
import secrets
import bech32

@api_view(['POST'])
def generate_private_key(request):
    # Generate a random 256-bit private key
    private_key_bytes = secrets.token_bytes(32)  # 32 bytes * 8 bits/byte = 256 bits
    
    # Convert bytes to hexadecimal string
    private_key_hex = private_key_bytes.hex()
    
    # Convert bytes to binary string
    private_key_binary = bin(int.from_bytes(private_key_bytes, byteorder='big'))[2:].zfill(256)
    
    # Convert bytes to decimal
    private_key_decimal = int.from_bytes(private_key_bytes, byteorder='big')
    private_key_decimal_str = f"{private_key_decimal}"

    
    # Return the private key in different formats
    return Response({
        "private_key_hex": private_key_hex,
        "private_key_binary": private_key_binary,
        "private_key_decimal": private_key_decimal_str
    })

@api_view(['POST'])
def generate_public_key(request):
    private_key_hex = request.data.get('private_key')
    if not private_key_hex:
        return Response({"error": "Private key is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Convert the private key from hexadecimal to bytes
        private_key_bytes = bytes.fromhex(private_key_hex)
        
        # Create a SigningKey object using SECP256k1 curve
        sk = ecdsa.SigningKey.from_string(private_key_bytes, curve=ecdsa.SECP256k1)
        vk = sk.verifying_key
        
        # Uncompressed public key (0x04 prefix)
        uncompressed_public_key = b'\04' + vk.to_string()
        
        # Compressed public key (0x02 or 0x03 prefix)
        x = vk.to_string()[:32]
        y = vk.to_string()[32:]
        if int.from_bytes(y, byteorder='big') % 2 == 0:
            compressed_public_key = b'\02' + x
        else:
            compressed_public_key = b'\03' + x
        
        return Response({
            "uncompressed_public_key": uncompressed_public_key.hex(),
            "compressed_public_key": compressed_public_key.hex()
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def generate_public_key_hash(request):
    public_key_hex = request.data.get('public_key')
    if not public_key_hex:
        return Response({"error": "Public key is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        public_key = bytes.fromhex(public_key_hex)
        sha256_bpk = hashlib.sha256(public_key).digest()
        ripemd160 = RIPEMD160.new()
        ripemd160.update(sha256_bpk)
        public_key_hash = ripemd160.digest()
        return Response({"public_key_hash": binascii.hexlify(public_key_hash).decode('utf-8')})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def generate_bitcoin_address(request):
    public_key_hash_hex = request.data.get('public_key_hash')
    if not public_key_hash_hex:
        return Response({"error": "Public key hash is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        public_key_hash = bytes.fromhex(public_key_hash_hex)
        versioned_payload = b'\x00' + public_key_hash
        checksum = hashlib.sha256(hashlib.sha256(versioned_payload).digest()).digest()[:4]
        binary_address = versioned_payload + checksum
        address = base58.b58encode(binary_address).decode()
        return Response({"bitcoin_address": address})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def generate_bech32_address_from_hash(request):
    public_key_hash_hex = request.data.get('public_key_hash')
    if not public_key_hash_hex:
        return Response({"error": "Public key hash is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Convert the public key hash from hex to bytes
        public_key_hash = bytes.fromhex(public_key_hash_hex)
        
        # Ensure the public key hash length is 20 bytes
        if len(public_key_hash) != 20:
            return Response({"error": "Public key hash must be 20 bytes."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Construct the P2WPKH script
        script_pub_key = b'\x00\x14' + public_key_hash  # 0x00 is the version byte for P2WPKH, 0x14 is the length of the hash
        
        # Encode to Bech32
        hrp = 'bc'  # Mainnet human-readable part (for Testnet, use 'tb')
        bech32_address = bech32.encode(hrp, 0x00, public_key_hash)
        
        return Response({"bech32_address": bech32_address})
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)