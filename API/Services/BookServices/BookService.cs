using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using static System.Reflection.Metadata.BlobBuilder;

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
                Category = fetchedCategory
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
                    NumOfDownloads = book.NumOfDownloads,
                    NumOfViews = book.NumOfViews,
                    IsPrivate = book.IsPrivate,
                    Category = _db.Categories.Find(book.CategoryId).Name
                };
                toReturn.Add(item);
            }
            return toReturn;
        }

        public List<BookDto> GetByPage(PaginationDto param)
        {
            int listSize = _db.Books.Count();
            int startIndex = (param.Page - 1) * param.PageSize;
            if (startIndex >= listSize) return null;
            var books = _db.Books.Skip(startIndex).Take(param.PageSize).ToList();
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
                    NumOfDownloads = book.NumOfDownloads,
                    NumOfViews = book.NumOfViews,
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
                    NumOfDownloads = book.NumOfDownloads,
                    NumOfViews = book.NumOfViews,
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
                    NumOfDownloads = x.NumOfDownloads,
                    NumOfViews = x.NumOfViews,
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

        public int AddDownloadedBook(FavouriteBookDto model)
        {
            var fetchedBook = _db.Books.Find(model.BookId);
            if(fetchedBook == null) return 0;
            var fetchedUser = _db.Users.FirstOrDefault(u => u.Email == model.Email);
            if (fetchedUser == null) return 1;
            if(fetchedUser.Point > 0)
            {
                fetchedBook.NumOfDownloads++;
                fetchedUser.Point--;
                _db.SaveChanges();
                return 2;
            }
            return 3;
            
        }
        public bool AddWatchedBook(int bookId)
        {
            var fetchedBook = _db.Books.Find(bookId);
            if (fetchedBook == null) return false;
            fetchedBook.NumOfViews++;
            _db.SaveChanges();
            return true;
        }

        // Favourite Book Function

        public int AddFavouriteBook(int bookId, string email)
        {
            var fetchedBook = _db.Books.FirstOrDefault(b => b.Id == bookId);
            if(fetchedBook == null) return 1;
            var fetchedUser = _db.Users.FirstOrDefault(u => u.Email == email);
            if (fetchedUser == null) return 2;
            var fetchedFavouriteBook = _db.FavouriteBooks.FirstOrDefault(fb => fb.UserId == fetchedUser.Id && fb.BookId == bookId);
            if (fetchedFavouriteBook != null) return 3;
            else
            {
                var itemToAdd = new FavouriteBook
                {
                    BookId = bookId,
                    Book = fetchedBook,
                    UserId = fetchedUser.Id,
                    User = fetchedUser
                };
                _db.FavouriteBooks.Add(itemToAdd);
                _db.SaveChanges();
                return 4;
            }
        }
        public bool RemoveFavouriteBook(int bookId, string email)
        {
            var fetchedFavouriteBook = _db.FavouriteBooks.FirstOrDefault(fb => fb.User.Email == email && fb.BookId == bookId);
            if (fetchedFavouriteBook == null) return false;
            _db.FavouriteBooks.Remove(fetchedFavouriteBook);
            _db.SaveChanges();
            return true;
        }
        public List<int> GetFavouriteBookId(string email)
        {
            var favouriteBooks = _db.FavouriteBooks.Where(fb => fb.User.Email == email).ToList();
            if (favouriteBooks.Count == 0) return null;
            var toReturn = new List<int>();
            foreach (var book in favouriteBooks)
            {
                toReturn.Add(book.BookId);
            }
            return toReturn;
        }
        public int FavouriteBookTotal(int bookId)
        {
            var favouriteBooks = _db.FavouriteBooks.Where(fb => fb.BookId == bookId).ToList();
            return favouriteBooks.Count;
        }


        public bool CheckFavouriteBook(int bookId, string email)
        {
            var fetchedFavouriteBook = _db.FavouriteBooks.FirstOrDefault(fb => fb.User.Email == email && fb.BookId == bookId);
            if (fetchedFavouriteBook != null) return true;
            return false;
        }

        // Watched Books Function
        public int AddWatchedBook(int bookId, string email)
        {
            var fetchedBook = _db.Books.FirstOrDefault(b => b.Id == bookId);
            if (fetchedBook == null) return 1;
            var fetchedUser = _db.Users.FirstOrDefault(u => u.Email == email);
            if (fetchedUser == null) return 2;
            var fetchedWatchedBook = _db.WatchedBooks.FirstOrDefault(fb => fb.UserId == fetchedUser.Id && fb.BookId == bookId);
            if (fetchedWatchedBook != null)
            {
                fetchedWatchedBook.TimeUp = DateTime.Now.ToString("MM/dd/yyyy HH:mm");
                _db.SaveChanges();
                return 3;
            }
            else
            {
                var itemToAdd = new WatchedBook
                {
                    BookId = bookId,
                    Book = fetchedBook,
                    UserId = fetchedUser.Id,
                    User = fetchedUser,
                    TimeUp = DateTime.Now.ToString("MM/dd/yyyy HH:mm")
                };
                _db.WatchedBooks.Add(itemToAdd);
                _db.SaveChanges();
                return 4;
            }
        }
        public List<int> GetWatchedBookId(string email)
        {
            var watchedBooks = _db.WatchedBooks.Where(fb => fb.User.Email == email).OrderByDescending(wb => wb.TimeUp).ToList();
            if (watchedBooks.Count == 0) return null;
            var toReturn = new List<int>();
            foreach (var book in watchedBooks)
            {
                toReturn.Add(book.BookId);
            }
            return toReturn;
        }
        
        public WatchedBookDto GetWatchedBook(int bookId)
        {
            var book = _db.Books
               .Where(x => x.Id == bookId)
               .Select(x => new WatchedBookDto
               {
                   Id = x.Id,
                   Title = x.Title,
                   Code = x.Code,
                   Author = x.Author,
                   ImageUrl = x.ImageUrl,
                   CreatedAt = _db.WatchedBooks.FirstOrDefault(wb=>wb.BookId == bookId).TimeUp
               })
               .FirstOrDefault();
            if (book == null) return null;
            return book;
        }
    }
}
