using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string TimeUp {  get; set; }
        public string Username { get; set; }
        public string ImageUrl { get; set; }
        public string Title { get; set; }
    }
}
