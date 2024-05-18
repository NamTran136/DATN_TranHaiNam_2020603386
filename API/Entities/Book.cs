﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Book
    {
        public int Id { get; set; }
        [Required]
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public string Language { get; set; }
        public string ImageUrl {  get; set; }
        public int NumOfDownloads { get; set; } = 0;
        public int NumOfViews { get; set; } = 0;
        public bool IsPrivate {  get; set; } = false;
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<FavouriteBook> FavouriteBooks { get; set; }
        public ICollection<WatchedBook> WatchedBooks { get; set; }
    }
}
