from django.urls import path
from .views import generate_private_key,generate_bech32_address_from_hash, generate_public_key, generate_public_key_hash, generate_bitcoin_address

urlpatterns = [
    path('generate-private-key/', generate_private_key, name='generate-private-key'),
    path('generate-public-key/', generate_public_key, name='generate-public-key'),
    path('generate-public-key-hash/', generate_public_key_hash, name='generate-public-key-hash'),
    path('generate-bitcoin-address/', generate_bitcoin_address, name='generate-bitcoin-address'),
    path('generate-bech32-address-from-hash/', generate_bech32_address_from_hash, name='generate_bech32_address_from_hash'),

]
