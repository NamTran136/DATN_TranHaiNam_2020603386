using API.DTOs;

namespace API.Services.UserServices
{
    public interface IUserService
    {
        List<PublicUserDto> GetAll();
        PublicUserDto GetByEmail(string email);
        PublicUserDto GetById(int id);
        bool Delete(int id);
        bool DeleteByEmail(string email);
        bool UsernameExists(string username);
    }
}
