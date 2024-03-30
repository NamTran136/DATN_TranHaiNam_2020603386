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
    }
}
