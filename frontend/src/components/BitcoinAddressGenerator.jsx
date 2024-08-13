/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// src/components/BitcoinAddressGenerator.js
import { useState } from "react";
import axios from "axios";
import { Typography, Button, TextField, Box, Divider } from "@mui/material";
import Alert from "@mui/material/Alert";
import Textarea from "@mui/joy/Textarea";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const BitcoinAddressGenerator = () => {
  const [privateKeyDemical, setPrivateKeyDemical] = useState("");
  const [privateKeyBinary, setPrivateKeyBinary] = useState("");
  const [privateKeyHex, setPrivateKeyHex] = useState("");

  const [publicKeyCo, setPublicKeyCo] = useState("");
  const [publicKeyUnco, setPublicKeyUnCo] = useState("");
  const [publicKeyHash, setPublicKeyHash] = useState("");

  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [bech32Address, setBech32Address] = useState("");

  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [error4, setError4] = useState("");

  const handleGeneratePrivateKey = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/generate-private-key/"
      );
      setPrivateKeyDemical(response.data.private_key_decimal);
      setPrivateKeyBinary(response.data.private_key_binary);
      setPrivateKeyHex(response.data.private_key_hex);
    } catch (err) {
      setError(
        "Error generating private key: " + err.response?.data?.error ||
          err.message
      );
    }
  };

  const handleGeneratePublicKey = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/generate-public-key/",
        { private_key: privateKeyHex }
      );
      setPublicKeyUnCo(response.data.uncompressed_public_key);
      setPublicKeyCo(response.data.compressed_public_key);
      setError1('')
    } catch (err) {
      setError1(
        "Error generating public key: " + err.response?.data?.error ||
          err.message
      );
    }
  };

  const handleGeneratePublicKeyHash = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/generate-public-key-hash/",
        { public_key: publicKeyCo }
      );
      setPublicKeyHash(response.data.public_key_hash);
      setError2('')

    } catch (err) {
      setError2(
        "Error generating public key hash: " + err.response?.data?.error ||
          err.message
      );
    }
  };

  const handleGenerateBitcoinAddress = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/generate-bitcoin-address/",
        { public_key_hash: publicKeyHash }
      );
      setBitcoinAddress(response.data.bitcoin_address);
      setError3('')

    } catch (err) {
      setError3(
        "Error generating Bitcoin address: " + err.response?.data?.error ||
          err.message
      );
    }
  };
  const handleGenerateAddress = async () => {
    try {
      setError(""); // Clear previous errors
      const response = await axios.post(
        "http://localhost:8000/generate-bech32-address-from-hash/",
        {
          public_key_hash: publicKeyHash,
        }
      );
      setBech32Address(response.data.bech32_address);
      setError4("");

    } catch (e) {
      setError4("An error occurred while generating the Bech32 address.");
      console.error(e);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        width: "65vw",
        mt: 10,
        p: "50px 50px 50px 50px",
        boxShadow: 10,
        borderRadius: "20px",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: "48px", fontWeight: "700" }}>
          {"Keys"}
        </Typography>
        <Typography sx={{ fontSize: "32px", fontWeight: "700", mb: 2 }}>
          {"Private Keys, Public Keys, Addresses"}
        </Typography>
        <img
          src="https://static.learnmeabitcoin.com/diagrams/png/keys.png"
          alt="btc"
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: "22px" }}>
          {"Anahtarlar Bitcoin Sahipliğini Kontrol Etmek İçin Kullanılır"}
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 2 }}>
          {
            "Bitcoin göndermek ve almak için tek yapmanız gereken, bir private key  ve public key çifti üretmektir."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 2 }}>
          <ul>
            <li>
              Açık anahtar, bir işlemde Bitcoin göndermek istediğinizde, bir
              çıkışın kilidine yerleştirilir. Bu, Bitcoin'lerinizi alıcıya
              yönlendirmek için kullanılır.
            </li>
            <li>
              Özel anahtar, bu çıkışı "harcamak" istediğinizde, yeni bir işlemde
              girdi olarak kullanmak için bir imza oluşturmak amacıyla
              kullanılır.
            </li>
          </ul>
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 2 }}>
          {
            "Özel anahtar ve genel anahtar çifti matematiksel olarak birbirine bağlıdır. İmzalar da öyle."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 2 }}>
          {
            "Dolayısıyla, bir imzayı genel anahtar ile birlikte sağladığınızda, aralarında matematiksel bir bağlantı olur; bu da Bitcoin'lerin işlemde harcamak için 'açılmasını' sağlar."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 2 }}>
          {
            "Başka bir deyişle, imza, genel anahtarın oluşturulduğu özel anahtarın sahibi olduğunuzu tek seferlik bir kanıtla gösterir. Hiç kimse, özel anahtara erişimi olmadan genel anahtarla matematiksel olarak bağlantılı bir imza üretemez."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 2 }}>
          {
            "İmzalar kullanarak, orijinal özel anahtarı ifşa etmek zorunda kalmazsınız, bu da aynı genel anahtara kilitlenmiş diğer Bitcoin'lerin çalınmasını önler."
          }
        </Typography>
        <Alert severity="info" sx={{ mt: 4, mb: 4, fontSize: "14px" }}>
          Bu mekanizma "public key cryptography" (açık anahtar kriptografisi)
          olarak bilinir. Bitcoin oluşturulmadan önce var olan bu yöntem,
          Satoshi tarafından coin'lerin sahipliğini kontrol etmek amacıyla
          kullanılmıştır.
        </Alert>
        <img
          src="https://static.learnmeabitcoin.com/diagrams/png/keys-address-public-key.png"
          alt="btc"
        />
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Son olarak, Bitcoin'de bu public key'leri adreslere dönüştürüyoruz; bu adresler sadece human-friendly (insan dostu) kodlamalardır."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 2 }}>
          {
            "Yani, birinin adresine bitcoin 'gönderdiğinizde', aslında bitcoin'leri public key'lerine kilitlemiş oluyorsunuz."
          }
        </Typography>
      </Box>
      <Divider variant="middle" sx={{ mt: 4 }} />

      <Box sx={{ mt: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: "48px", fontWeight: "700" }}>
            {"Private Key"}
          </Typography>
          <img
            src="https://static.learnmeabitcoin.com/diagrams/png/keys-private-key.png"
            alt="btc"
          />
        </Box>
        <Box sx={{ backgroundColor: "#EEEEEE", p: 4, borderRadius: "10px" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#00ADB5", height: "40px", mb: 2 }}
            onClick={handleGeneratePrivateKey}
          >
            Generate Private Key
          </Button>

          <TextField
            label="Binary"
            variant="outlined"
            fullWidth
            margin="normal"
            value={privateKeyBinary}
            sx={{ height: "70px" }}
            InputProps={{ readOnly: true }}
          />
                    {error && <Typography color="error" sx={{mt:1}}>{error}</Typography>}

          <TextField
            label="Demical"
            variant="outlined"
            fullWidth
            margin="normal"
            value={privateKeyDemical}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Hexadecimal"
            variant="outlined"
            fullWidth
            margin="normal"
            value={privateKeyHex}
            InputProps={{ readOnly: true }}
          />
        </Box>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Bir private key (özel anahtar), 256-bit rastgele üretilmiş bir sayıdır."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          {
            "Geçerli private key (özel anahtar) aralığı, 0 ile 115792089237316195423570985008687907852837564279074904382605163141518161494336 arasındadır."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          {
            "Private key'ler genellikle 32-byte'lık (byte) hexadecimal (onaltılı) dizgiler olarak görüntülenir. Ancak nihayetinde, bu sadece rastgele bir sayıdır."
          }
        </Typography>
        <Alert severity="info" sx={{ mt: 4, mb: 4, fontSize: "14px" }}>
          O kadar çok olası private key (özel anahtar) vardır ki, rastgele bir
          tane üretmek, başkalarının sizinle aynı olanını üretmesini
          sağlamayacak kadar yeterlidir. Buna inanmak zor olabilir, ancak
          aslında, 256-bit bir sayı o kadar büyüktür ki, bu aralıkta iki kişinin
          aynı rastgele numarayı üretmesi etkili bir şekilde imkansızdır.
        </Alert>
      </Box>
      <Divider variant="middle" sx={{ mt: 2 }} />

      <Box>
        <Box sx={{ mb: 3, mt: 3 }}>
          <Typography sx={{ fontSize: "48px", fontWeight: "700" }}>
            {"Public Key"}
          </Typography>
          <img
            src="https://static.learnmeabitcoin.com/diagrams/png/keys-public-key.png"
            alt="btc"
          />
        </Box>
        <Box sx={{ backgroundColor: "#EEEEEE", p: 4, borderRadius: "10px" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#00ADB5", height: "40px", mb: 2 }}
            onClick={handleGeneratePublicKey}
          >
            Get Public Key
          </Button>
          <TextField
            label="Hexadecimal Private Key"
            variant="outlined"
            fullWidth
            margin="normal"
            value={privateKeyHex}
            onChange={(e) => {
              setPrivateKeyHex(e.target.value);
            }}
          />
          {error1 && <Typography color="error" sx={{mt:1}}>{error1}</Typography>}
          <TextField
            label="Uncompressed Public key"
            variant="outlined"
            fullWidth
            margin="normal"
            value={publicKeyUnco}
            sx={{ height: "70px" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Compressed Public key"
            variant="outlined"
            fullWidth
            margin="normal"
            value={publicKeyCo}
            sx={{ height: "70px" }}
            InputProps={{ readOnly: true }}
          />
        </Box>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Bir public key (açık anahtar), bir private key (özel anahtar) kullanılarak hesaplanan bir koordinatlar kümesidir."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          {
            "Bu koordinatlar kümesi, elliptic curve cryptography (eliptik eğri kriptografisi) kullanılarak hesaplanır ve bu, private key ile public key arasında matematiksel bir bağlantı oluşturur."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          {
            "Bu özel matematiksel bağlantı, private key'den imzalar oluşturabilmemizi sağlar ve bu imzalar da public key ile matematiksel olarak bağlantılıdır. Bu, private key'e sahip olduğumuzu, onu ifşa etmeden kanıtlamamızı sağlar."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          {
            "Kısacası, bir public key gördüğünüzde, aslında çok büyük bir grafikte x ve y koordinatları kümesini görüyorsunuz."
          }
        </Typography>
        <Alert severity="info" sx={{ mt: 4, mb: 4, fontSize: "14px" }}>
          Sıkıştırılmış(Compressed ) Public Key'ler (Açık Anahtarlar). Public
          key, x ve y koordinatlarından oluşsa da, elliptic curve cryptography
          (eliptik eğri kriptografisi) matematiği nedeniyle, public key'in tam
          y-koordinatını saklamamız gerekmez. Bunun yerine, sadece 32-byte
          (256-bit) x-değerini saklayabiliriz ve y-koordinatının çift mi yoksa
          tek mi olduğunu belirten 1-byte'lık bir ön ek ekleyebiliriz. Bu,
          sıkıştırılmış public key olarak bilinir ve Bitcoin'de gördüğünüz ve
          kullandığınız en yaygın public key türüdür.
        </Alert>
      </Box>
      <Divider variant="middle" sx={{ mt: 4 }} />

      <Box sx={{ mt: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: "48px", fontWeight: "700" }}>
            {"Address"}
          </Typography>
          <img
            src="https://static.learnmeabitcoin.com/diagrams/png/keys-address-public-key.png"
            alt="btc"
          />
        </Box>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Bir adres, esasen bir genel anahtarın insan dostu bir şekilde kodlanmış halidir."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          {"Bir adresin ham bir genel anahtardan daha fazla avantajı vardır:"}
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          <ul>
            <li>
              Kısa: Bir adres, bir genel anahtardan daha kısadır. Bu,
              gerektiğinde manuel olarak yazmayı daha hızlı hale getirir.
            </li>
            <li>
              Hata Tespiti: Bir adres bir kontrol işareti (checksum) içerir, bu
              da hata yapmanız durumunda hataları tespit etmeye yardımcı olur.
              Bu, Bitcoin'leri geçersiz bir genel anahtara göndermeyi ve bu
              nedenle onları sonsuza kadar kaybetmeyi önler.
            </li>
          </ul>
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 1, mb: 4 }}>
          {
            "Şimdi, Bitcoin'de kullanabileceğiniz farklı türde adresler vardır. Kullanacağınız tür, bir çıktıya koymak istediğiniz kilidin türüne bağlıdır:"
          }
        </Typography>
        <Accordion sx={{ backgroundColor: "#EEEEEE" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Base58 Address (P2PKH)
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                backgroundColor: "#EEEEEE",
                p: 4,
                borderRadius: "10px",
              }}
            >
              <Alert severity="warning" sx={{ mt: 0, mb: 1, fontSize: "14px" }}>
                Bu, bir eski adres formatıdır. Bu format, Segregated Witness
                güncellemesi tanıtılmadan önce 2016 yılına kadar yaygın olarak
                kullanılıyordu. Hâlâ kullanılabilir, ancak artık daha yaygın
                olarak Bech32 adresleri kullanılmaktadır (aşağıya bakınız).
              </Alert>
              <img
                src="https://static.learnmeabitcoin.com/diagrams/png/script-p2pkh.png"
                alt="aa"
              />
              <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                {
                  "Bir base58 adresi, eski P2PKH kilitleme script'ine karşılık gelir."
                }
              </Typography>
              <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                {
                  "Bir base58 adresi oluşturmak için, önce public key'i HASH160 ile kısaltmanız gerekir. Bu, public key'i 33-byte'tan 20-byte'lık bir public key hash'ine kısaltır:"
                }
              </Typography>
              <Box sx={{ border: 1, p: 4 }}>
                <Typography sx={{ fontSize: "36px", fontWeight: "700", mb: 3 }}>
                  {"HASH160"}
                </Typography>
                <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                  {
                    "SHA-256 + RIPEMD-160. Bir genel anahtarı veya script'i adrese dönüştürmeden önce kısaltmak için kullanılır."
                  }
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#00ADB5", height: "40px", mb: 2 }}
                  onClick={handleGeneratePublicKeyHash}
                >
                  Get Public Key Hash
                </Button>
                <TextField
                  label="compressed Public key"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) => {
                    setPublicKeyCo(e.target.value);
                  }}
                  value={publicKeyCo}
                />
                          {error2 && <Typography color="error" sx={{mt:1}}>{error2}</Typography>}

                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="https://static.learnmeabitcoin.com/assets/icons/hash-function.svg"
                      style={{ height: "40px", marginRight: "10px" }}
                      alt="aa"
                    />
                    SHA-256
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <img
                      src="https://static.learnmeabitcoin.com/assets/icons/hash-function.svg"
                      style={{ height: "40px", marginRight: "10px" }}
                      alt="aa"
                    />
                    RIPEMD-160
                  </Box>
                </Box>
                <Typography sx={{ fontSize: "12px", mt: 3, mb: 1 }}>
                  {"HASH160"}
                </Typography>
                <TextField
                  label="Public Key Hash"
                  variant="outlined"
                  fullWidth
                  value={publicKeyHash}
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Typography sx={{ fontSize: "20px", mt: 4, mb: 2 }}>
                {
                  "Bu public key hash'ini Base58Check kodlamasından geçirirsiniz; bu, public key hash'e bir kontrol toplamı ekler ve ardından her şeyi base58 karakterlerine dönüştürür"
                }
              </Typography>
              <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                {
                  "Başında ayrıca 1-byte 00 öneki bulunur; bu, adresin bir public key hash içerdiğini ve bir P2PKH kilidi oluşturmak için kullanılacağını belirtir:"
                }
              </Typography>

              <Box sx={{ mt: 4, border: 1, p: 4 }}>
                <Typography sx={{ fontSize: "36px", fontWeight: "700", mb: 3 }}>
                  {"Address (Base58)"}
                </Typography>
                <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                  {"Bir public key'in hash160'ını encode edin"}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#00ADB5", height: "40px", mb: 4 }}
                  onClick={handleGenerateBitcoinAddress}
                >
                  Get Bitcoin address
                </Button>
                <TextField
                  label="Public Key Hash"
                  variant="outlined"
                  fullWidth
                  value={publicKeyHash}
                  onChange={(e) => {
                    setPublicKeyHash(e.target.value);
                  }}
                />
                {error3 && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {error3}
                  </Typography>
                )}
                <TextField
                  label="Bitcoin Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={bitcoinAddress}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: "#EEEEEE" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Bech32 Address (P2WPKH){" "}
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                backgroundColor: "#EEEEEE",
                p: 4,
                borderRadius: "10px",
              }}
            >
              <img
                src="https://static.learnmeabitcoin.com/diagrams/png/script-p2wpkh.png"
                alt="aa"
              />
              <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                {
                  "Bir bech32 adresi, bir P2WPKH kilitleme scriptine karşılık gelir."
                }
              </Typography>
              <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                {
                  "Bir bech32 adresi oluşturmak için, önce 33-baytlık sıkıştırılmış bir public key'i HASH160'a sokarak 20-baytlık bir public key hash'ine dönüştürürsünüz:"
                }
              </Typography>
              <Box sx={{ border: 1, p: 4 }}>
                <Typography sx={{ fontSize: "36px", fontWeight: "700", mb: 3 }}>
                  {"HASH160"}
                </Typography>
                <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                  {
                    "SHA-256 + RIPEMD-160. Bir genel anahtarı veya script'i adrese dönüştürmeden önce kısaltmak için kullanılır."
                  }
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#00ADB5", height: "40px", mb: 2 }}
                  onClick={handleGeneratePublicKeyHash}
                >
                  Get Public Key Hash
                </Button>
                <TextField
                  label="compressed Public key"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) => {
                    setPublicKeyCo(e.target.value);
                  }}
                  value={publicKeyCo}
                />
                          {error2 && <Typography color="error" sx={{mt:1}}>{error2}</Typography>}

                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="https://static.learnmeabitcoin.com/assets/icons/hash-function.svg"
                      style={{ height: "40px", marginRight: "10px" }}
                      alt="aa"
                    />
                    SHA-256
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <img
                      src="https://static.learnmeabitcoin.com/assets/icons/hash-function.svg"
                      style={{ height: "40px", marginRight: "10px" }}
                      alt="aa"
                    />
                    RIPEMD-160
                  </Box>
                </Box>
                <Typography sx={{ fontSize: "12px", mt: 3, mb: 1 }}>
                  {"HASH160"}
                </Typography>
                <TextField
                  label="Public Key Hash"
                  variant="outlined"
                  fullWidth
                  value={publicKeyHash}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Alert severity="error" sx={{ mt: 4, mb: 4, fontSize: "14px" }}>
                Bech32 adresi oluştururken yalnızca sıkıştırılmış public key'ler
                kullanmalısınız.
              </Alert>
              <Typography sx={{ fontSize: "20px", mt: 4, mb: 2 }}>
                {
                  "Bu public key hash'ini bech32 adresine dönüştürmeden önce, tam P2WPKH ScriptPubKey'yi oluşturmanız gerekir."
                }
              </Typography>

              <Box sx={{ mt: 4, border: 1, p: 4 }}>
                <Typography sx={{ fontSize: "36px", fontWeight: "700", mb: 3 }}>
                  {"Address (Bech32)"}
                </Typography>
                <Typography sx={{ fontSize: "20px", mt: 1, mb: 2 }}>
                  {
                    "P2WPKH veya P2WSH kilitleme script'ini bir adrese kodlayın."
                  }
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#00ADB5", height: "40px", mb: 4 }}
                  onClick={handleGenerateAddress}
                >
                  Get Bitcoin address
                </Button>
                <TextField
                  label="Public Key Hash"
                  variant="outlined"
                  fullWidth
                  value={publicKeyHash}
                  onChange={(e) => {
                    setPublicKeyHash(e.target.value);
                  }}
                />
                          {error4 && <Typography color="error" sx={{mt:1}}>{error4}</Typography>}

                <TextField
                  label="Bitcoin Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={bech32Address}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: "48px", fontWeight: "700" }}>
          {"Özet"}
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Bitcoin göndermek ve almak için bir çift anahtar oluşturmanız gerekir: bir özel anahtar ve bir genel anahtar."
          }
        </Typography>{" "}
        <Typography sx={{ fontSize: "20px", mt: 1 }}>
          <ul>
            <li>
              Özel Anahtar: Sadece sizin bildiğiniz gizli bir numaradır.
              Bitcoin'leri "harcamak" için dijital imza oluşturmanıza olanak
              tanır.
            </li>
            <li>
              Genel Anahtar: Özel anahtardan türetilen ve başkalarına görünür
              olan bir numaradır. İmzanızı doğrulamak için kullanılır.
            </li>
          </ul>
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Bu anahtarlar matematiksel olarak birbirine bağlıdır ve bu matematiksel bağlantı, Bitcoin'leri 'göndermeyi' ve 'almayı' mümkün kılar. Bu özel matematiksel yöntem, Bitcoin'den önce var olan elliptik eğri kriptografisi olarak bilinir."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Bu anahtarlar matematiksel olarak birbirine bağlıdır ve bu matematiksel bağlantı, Bitcoin'leri 'göndermeyi' ve 'almayı' mümkün kılar. Bu özel matematiksel yöntem, Bitcoin'den önce var olan elliptik eğri kriptografisi olarak bilinir."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Bitcoin'de genellikle genel anahtarları adrese dönüştürürüz, bu da işlemleri daha kısa ve kullanıcı dostu hale getirir. Bu adresler, genel anahtarın hash'ini içerir ve bazı Bitcoin'lere koymak istediğimiz kilidin belirli türüne karşılık gelir (örneğin, P2PKH veya P2WPKH). Dolayısıyla, adres türü, genel anahtar hash'inin Bitcoin'in içsel Script dilini kullanarak nasıl kilitlenip açıldığını belirtir."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Sonuçta, bir adresi genel anahtarın insan dostu bir kodlaması olarak düşünmek en kolay yoldur."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Adresler, Bitcoin içinde doğrudan kullanılmaz. Blockchain'deki ham verileri taradığınızda yalnızca genel anahtarlar ve imzalar bulursunuz."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {
            "Kendi Bitcoin programlamanızı yapmayı ilginç buluyorsanız, kendi anahtarlarınızı (ve adreslerinizi) oluşturmak iyi bir başlangıç olabilir. Ancak bir hata yaparsanız Bitcoin kaybetme riski olduğunu unutmayın… bunu nasıl bildiğimi sormayın."
          }
        </Typography>
        <Typography sx={{ fontSize: "20px", mt: 4 }}>
          {"Ama dikkatli olursanız sorun yaşamazsınız."}
        </Typography>
      </Box>
    </Box>
  );
};

export default BitcoinAddressGenerator;
