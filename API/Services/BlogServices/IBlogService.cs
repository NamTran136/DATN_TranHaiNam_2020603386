using API.DTOs;
using API.Entities;

namespace API.Services.BlogServices
{
    public interface IBlogService
    {
        List<BlogDto> GetAll();
        bool DeleteBlog(int id);
        BlogInfoDto GetOne(int id);
    }
}
