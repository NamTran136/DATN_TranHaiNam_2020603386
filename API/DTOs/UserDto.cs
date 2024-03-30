using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public bool IsAdmin { get; set; } = false;
        public string ImageUrl { get; set; }
        public int Point { get; set; } = 20;
    }
}
