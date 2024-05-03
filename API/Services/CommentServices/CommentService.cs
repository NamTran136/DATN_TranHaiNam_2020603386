using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services.CommentServices
{
    public class CommentService : ICommentService
    {
        private readonly DataDbContext _db;
        public CommentService(DataDbContext db)
        {
            _db = db;
        }

        public List<CommentDto> GetAll()
        {
            var comments = _db.Comments
                .Select(x => new CommentDto
                {
                    Id = x.Id,
                    Content = x.Content,
                    TimeUp = x.CreatedAt.ToString("MM/dd/yyyy HH:mm"),
                    Title = x.Book.Title,
                    ImageUrl = x.User.ImageUrl,
                    Username = x.User.Username
                }).ToList();
            return comments;
        }

        public List<CommentDto> GetByBook(int id)
        {
            var comments = _db.Comments
                .Where(x => x.BookId == id)
                .OrderByDescending(n => n.CreatedAt)
                .Select(x => new CommentDto
                {
                    Id = x.Id,
                    Content = x.Content,
                    TimeUp = x.CreatedAt.ToString("MM/dd/yyyy HH:mm"),
                    Title = x.Book.Title,
                    ImageUrl = x.User.ImageUrl,
                    Username = x.User.Username
                }).ToList();
            return comments;
        }
        public CommentDto GetOne(int id)
        {
            var comment = _db.Comments
                .Where(x => x.Id == id)
                .Select(x => new CommentDto
                {
                    Id = x.Id,
                    Content = x.Content,
                    TimeUp = x.CreatedAt.ToString("MM/dd/yyyy HH:mm"),
                    Title = x.Book.Title,
                    ImageUrl = x.User.ImageUrl,
                    Username = x.User.Username
                }).FirstOrDefault();
            return comment;
        }

        public int Add(CommentAddOrEditDto comment)
        {
            var fetchedUser = _db.Users.FirstOrDefault(x => x.Email == comment.Email);
            if(fetchedUser == null)
            {
                return 1;
            }
            var commentToAdd = new Comment
            {
                Content = comment.Content,
                CreatedAt = DateTime.Now,
                BookId = comment.BookId,
                UserId = fetchedUser.Id
            };
            _db.Comments.Add(commentToAdd);
            _db.SaveChanges();
            return 0;
        }
        public bool Delete(int id)
        {
            var fetchedComment = _db.Comments.FirstOrDefault(x => x.Id == id);
            if (fetchedComment == null)
            {
                return false;
            }
            _db.Comments.Remove(fetchedComment);
            _db.SaveChanges();
            return true;
        }
    }
}
