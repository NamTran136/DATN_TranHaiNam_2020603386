using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public string Language { get; set; }
        public string ImageUrl { get; set; }
        public int NumOfDownloads { get; set; } 
        public int NumOfViews { get; set; } 
        public int CategoryId {  get; set; }
        public bool IsPrivate { get; set; }
        public string Category { get; set; }
    }
}
