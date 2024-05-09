using API.DTOs;
using API.Entities;

namespace API.Services.BookServices
{
    public interface IBookService
    {
        bool CodeBookExists(string code);
        bool Add(BookAddEditDto book);
        bool Update(BookAddEditDto book);
        List<BookDto> GetAll();
        BookDto GetById(int id);
        bool Delete(int id);
        Category GetCategoryByName(string name);
        List<BookDto> GetBookByCategory(int id);
        List<BookDto> GetByPage(PaginationDto param);
        bool AddWatchedBook(int bookId);
        int AddDownloadedBook(FavouriteBookDto model);

        // Favourite Book
        int AddFavouriteBook(int bookId, string email);
        List<int> GetFavouriteBookId(string email);
        int FavouriteBookTotal(int bookId);
        bool RemoveFavouriteBook(int bookId, string email);
        bool CheckFavouriteBook(int bookId, string email);
        // Watched Book
        int AddWatchedBook(int bookId, string email);
        List<int> GetWatchedBookId(string email);
        WatchedBookDto GetWatchedBook(int bookId);
    }
}
