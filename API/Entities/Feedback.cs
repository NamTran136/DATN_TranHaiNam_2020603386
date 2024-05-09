using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Feedback
    {
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Filename { get; set; }
        public bool IsActive { get; set; } = false;

    }
}
