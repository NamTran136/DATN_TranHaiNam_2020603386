using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public bool IsAdmin { get; set; } = false;
        public string ImageUrl { get; set; } = "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png";
        public int Point { get; set; } = 20;
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
        public ICollection<FavouriteBook> FavouriteBooks { get; set; }
        public ICollection<WatchedBook> WatchedBooks { get; set; }
    }
}
