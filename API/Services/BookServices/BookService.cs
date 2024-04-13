using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services.BookServices
{
    public class BookService : IBookService
    {
        private readonly DataDbContext _db;
        public BookService(DataDbContext db)
        {
            _db = db;
        }
        public bool Add(BookAddEditDto book)
        {
            var fetchedCategory = GetCategoryByName(book.Category);
            var bookToAdd = new Book
            {
                Title = book.Title,
                Code = book.Code,
                Description = book.Description,
                Author = book.Author,
                Language = book.Language,
                IsPrivate = book.IsPrivate,
                ImageUrl = book.ImageUrl,
                CategoryId = fetchedCategory.Id,
                // Category = fetchedCategory
            };
            _db.Books.Add(bookToAdd);
            _db.SaveChanges();
            return true;
        }

        public bool CodeBookExists(string code)
        {
            return _db.Books.Any(x => x.Code == code);
        }

        public bool Delete(int id)
        {
            var fetchedBook = _db.Books.Find(id); 
            if(fetchedBook == null)
            {
                return false;
            }
            _db.Books.Remove(fetchedBook);
            _db.SaveChanges();
            return true;
        }
        public List<BookDto> GetAll()
        {
            var books = _db.Books.ToList();
            if (books.Count == 0) return null;
            var toReturn = new List<BookDto>();
            foreach (var book in books)
            {
                var item = new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Code = book.Code,
                    Description = book.Description,
                    Author = book.Author,
                    Language = book.Language,
                    CategoryId = book.CategoryId,
                    ImageUrl = book.ImageUrl,
                    IsPrivate = book.IsPrivate,
                    Category = _db.Categories.Find(book.CategoryId).Name
                };
                toReturn.Add(item);
            }
            return toReturn;
        }

        public List<BookDto> GetBookByCategory(int id)
        {
            var books = _db.Books.Where(x => x.CategoryId == id).ToList();
            if (books.Count == 0) return null;
            var toReturn = new List<BookDto>();
            foreach (var book in books)
            {
                var item = new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Code = book.Code,
                    Description = book.Description,
                    Author = book.Author,
                    Language = book.Language,
                    CategoryId = book.CategoryId,
                    ImageUrl = book.ImageUrl,
                    IsPrivate = book.IsPrivate,
                    Category = _db.Categories.Find(book.CategoryId).Name
                };
                toReturn.Add(item);
            }
            return toReturn;
        }

        public BookDto GetById(int id)
        {
            var book = _db.Books
                .Where(x => x.Id == id)
                .Select(x => new BookDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Code = x.Code,
                    Description = x.Description,
                    Author = x.Author,
                    Language = x.Language,
                    CategoryId = x.CategoryId,
                    ImageUrl = x.ImageUrl,
                    IsPrivate = x.IsPrivate,
                    Category = x.Category.Name
                })
                .FirstOrDefault();
            if (book == null) return null;
            return book;
        }

        public bool Update(BookAddEditDto book)
        {
            var fetchedBook = _db.Books.Find(book.Id);
            var fetchedCategory = GetCategoryByName(book.Category);
            fetchedBook.Title = book.Title;
            fetchedBook.Code = book.Code;
            fetchedBook.Description = book.Description;
            fetchedBook.Author = book.Author;
            fetchedBook.Language = book.Language;
            fetchedBook.IsPrivate = book.IsPrivate;
            fetchedBook.ImageUrl = book.ImageUrl;
            fetchedBook.CategoryId = fetchedCategory.Id;
            fetchedBook.Category = fetchedCategory;
            _db.SaveChanges();
            return true;
        }

        public Category GetCategoryByName(string name)
        {
            return _db.Categories.SingleOrDefault(x => x.Name.ToLower() == name.ToLower());
        }
    }
}
