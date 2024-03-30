using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class GoogleDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string ImageUrl { get; set; }
    }
}
