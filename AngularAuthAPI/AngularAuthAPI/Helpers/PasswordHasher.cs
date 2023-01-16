using System.Security.Cryptography;

namespace AngularAuthAPI.Helpers
{
    public class PasswordHasher
    {
        private static RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();

        private static readonly int _saltSize = 16;
        private static readonly int _hashSize = 20;
        private static readonly int _iterations = 10000;

        public static string HashPassword(string password)
        {
            byte[] salt;
            rng.GetBytes(salt = new byte[_saltSize]);
            var key = new Rfc2898DeriveBytes(password, salt, _iterations);
            var hash = key.GetBytes(_hashSize);
            var hashBytes = new byte[_saltSize + _hashSize];
            Array.Copy(salt, 0, hashBytes, 0, _saltSize);
            Array.Copy(hash, 0, hashBytes, _saltSize, _hashSize);
            var base64Hash=Convert.ToBase64String(hashBytes);
            return base64Hash;
        }

        public static bool VerifyPassword(string password, string base64Hash)
        {
            var hashBytes=Convert.FromBase64String(base64Hash);
            var salt=new byte[_saltSize];
            Array.Copy(hashBytes, 0, salt, 0, _saltSize);
            var key=new Rfc2898DeriveBytes(password, salt, _iterations);
            byte[] hash = key.GetBytes(_hashSize);

            for (var i = 0; i < _hashSize; i++)
            {
                if(hashBytes[i+_saltSize] != hash[i])
                    return false;

            }

            return true;
        }
    }
}
