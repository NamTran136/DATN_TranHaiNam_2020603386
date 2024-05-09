using API.Data;
using API.DTOs;
using System.Security.Cryptography;

namespace API.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly DataDbContext _dBcontext;
        public UserService(DataDbContext dbcontext)
        {
            _dBcontext = dbcontext;
        }
        public bool Delete(int id)
        {
            var user = _dBcontext.Users.Find(id);
            if (user == null)
            {
                return false;
            }
            _dBcontext.Users.Remove(user);
            _dBcontext.SaveChanges();
            return true;
        }

        public bool DeleteByEmail(string email)
        {
            var user = _dBcontext.Users.FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return false;
            }
            _dBcontext.Users.Remove(user);
            _dBcontext.SaveChanges();
            return true;
        }

        public List<PublicUserDto> GetAll()
        {
            var users = _dBcontext.Users.Where(u => u.IsAdmin == false).ToList();
            var toReturn = new List<PublicUserDto>();
            foreach (var user in users)
            {
                var item = new PublicUserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    ImageUrl = user.ImageUrl
                };
                toReturn.Add(item);
            }
            return toReturn;
        }

        public PublicUserDto GetByEmail(string email)
        {
            var user = _dBcontext.Users.FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return null;
            }
            var toReturn = new PublicUserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                ImageUrl = user.ImageUrl
            };
            return toReturn;
        }

        public PublicUserDto GetById(int id)
        {
            var user = _dBcontext.Users.Find(id);
            if (user == null)
            {
                return null;
            }
            var toReturn = new PublicUserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                ImageUrl = user.ImageUrl
            };
            return toReturn;
        }

        
        public bool UsernameExists(string username)
        {
            var fetchedUser = _dBcontext.Users.FirstOrDefault(x => x.Username == username);
            if (fetchedUser == null) return false;
            return true;
        }
    }
}
