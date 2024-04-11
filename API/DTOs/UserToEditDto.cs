using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UserToEditDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? ImageUrl {  get; set; }
    }
}
