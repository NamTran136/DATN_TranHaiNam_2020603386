using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CategoryAddEditDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
