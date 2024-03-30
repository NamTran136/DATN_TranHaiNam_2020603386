using API.DTOs;

namespace API.Services.UserServices
{
    public interface IUserService
    {
        List<PublicUserDto> GetAll();
        PublicUserDto GetByEmail(string email);
        PublicUserDto GetById(int id);
        int Update(UserToEditDto dto);
        bool Delete(int id);
        bool UsernameExists(string username);
    }
}
