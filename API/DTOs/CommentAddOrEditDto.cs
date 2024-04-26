using API.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CommentAddOrEditDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public int BookId { get; set; }
    }
}
