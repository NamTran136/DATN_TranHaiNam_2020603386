using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Services.Auth
{
    public interface IAuthService
    {
        void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
        bool VarifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);
        Task<bool> CheckUsername(string username);
        Task<bool> CheckEmail(string email);
        Task<bool> CreateGoogleUser(GoogleDto model);
        Task<bool> CreateUser(RegisterDto model);
        Task<User> GetUserByEmail(string email);
    }
}
