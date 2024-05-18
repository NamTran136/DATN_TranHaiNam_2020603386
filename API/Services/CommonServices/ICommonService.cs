using API.DTOs;

namespace API.Services.CommonServices
{
    public interface ICommonService
    {
        int Count(int select);
        List<BookDto> SearchBook(string input, int index);
        List<CategoryDto> GetTopCategories();
        List<PublicUserDto> SearchUser(string input, int index);
    }
}
