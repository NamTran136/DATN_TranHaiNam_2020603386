using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class WatchedBook
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int BookId { get; set; }
        public Book Book { get; set; }
        public string TimeUp { get; set; }
    }
}
