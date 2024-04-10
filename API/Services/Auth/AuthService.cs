﻿using API.Data;
using API.DTOs;
using API.Entities;
using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace API.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly DataDbContext _context;
        public AuthService(DataDbContext context)
        {
            _context = context;
        }
        public async Task<bool> CheckEmail(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }

        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        public bool VarifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public async Task<bool> CheckUsername(string username)
        {
            return await _context.Users.AnyAsync(x => x.Username.ToLower() == username.ToLower());
        }

        public async Task<bool> CreateUser(RegisterDto model)
        {
            CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var userToAdd = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
            };
            await _context.Users.AddAsync(userToAdd);
            await _context.SaveChangesAsync();
            return true;
        }

        public int Update(UserToEditDto dto)
        {
            var fetchedUser = _context.Users.FirstOrDefault(x => x.Email == dto.Email);
            if (fetchedUser == null)
            {
                return 1;
            }
            if (fetchedUser.Username != dto.Username && UsernameExists(dto.Username))
            {
                return 2;
            }

            fetchedUser.Username = dto.Username;
            if (!String.IsNullOrEmpty(dto.Password))
            {
                byte[] passwordHash, passwordSalt;
                using (var hmac = new HMACSHA512())
                {
                    passwordSalt = hmac.Key;
                    passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(dto.Password));
                }
                fetchedUser.PasswordHash = passwordHash;
                fetchedUser.PasswordSalt = passwordSalt;
            }
            fetchedUser.ImageUrl = dto.ImageUrl;
            _context.SaveChanges();
            return 0;
        }

        public async Task<bool> CreateGoogleUser(GoogleDto model)
        {
            CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var userToAdd = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                ImageUrl = model.ImageUrl
            };
            await _context.Users.AddAsync(userToAdd);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var _user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (_user == null)
            {
                return null;
            }
            return _user;
        }
        public bool UsernameExists(string username)
        {
            var fetchedUser = _context.Users.FirstOrDefault(x => x.Username == username);
            if (fetchedUser == null) return false;
            return true;
        }
    }
}
