using API.DTOs;

namespace API.Services.CommentServices
{
    public interface ICommentService
    {
        List<CommentDto> GetAll();
        List<CommentDto> GetByBook(int id);
        int Add(CommentAddOrEditDto comment);
        bool Delete(int id);
        CommentDto GetOne(int id);
        string ConvertDatetime(DateTime dateTime);

    }
}
