using API.Data;
using API.DTOs;

namespace API.Services.FeedbackServices
{
    public class FeedbackService : IFeedbackService
    {
        private readonly DataDbContext _db;
        public FeedbackService(DataDbContext db)
        {
            _db = db;
        }

        public List<FeedbackDto> GetAll()
        {
            var feedbacks = _db.Feedbacks.OrderByDescending(f=>f.CreatedAt).ToList();
            if (feedbacks.Count == 0) return null;
            var toReturn = new List<FeedbackDto>();
            foreach (var feedback in feedbacks)
            {
                var item = new FeedbackDto
                {
                    Id = feedback.Id,
                    Username = _db.Users.FirstOrDefault(u => u.Id == feedback.UserId).Username,
                    Avatar = _db.Users.FirstOrDefault(u => u.Id == feedback.UserId).ImageUrl,
                    Title = feedback.Title,
                    Content = feedback.Content,
                    CreatedAt = feedback.CreatedAt.ToString("MM/dd/yyyy HH:mm"),
                    Filename = feedback.Filename,
                    IsActive = feedback.IsActive,
                };
                toReturn.Add(item);
            }
            return toReturn;
        }
        public FeedbackDto GetOne(int id)
        {
            var feedback = _db.Feedbacks.Where(f=>f.Id == id).Select(f=>new FeedbackDto
            {
                Id = f.Id,
                Username = _db.Users.FirstOrDefault(u => u.Id == f.UserId).Username,
                Avatar = _db.Users.FirstOrDefault(u => u.Id == f.UserId).ImageUrl,
                Title = f.Title,
                Content = f.Content,
                CreatedAt = f.CreatedAt.ToString("MM/dd/yyyy HH:mm"),
                Filename = f.Filename,
                IsActive = f.IsActive,
            }).FirstOrDefault();
            if (feedback == null) return null;
            return feedback;
        }
        public bool DeleteFeedback(int id)
        {
            var feedback = _db.Feedbacks.FirstOrDefault(f => f.Id == id);
            if (feedback == null) return false;
            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", feedback.Filename);
            if (File.Exists(filepath))
            {
                File.SetAttributes(filepath, FileAttributes.Normal);
                File.Delete(filepath);
            }
            _db.Feedbacks.Remove(feedback);
            _db.SaveChanges();
            return true;
        }

        public int ActiveFeedback(int id)
        {
            var feedback = _db.Feedbacks.FirstOrDefault(f => f.Id == id);
            if (feedback == null) return 1;
            var user = _db.Users.FirstOrDefault(u=>u.Id == feedback.UserId);
            if (user == null) return 2;
            feedback.IsActive = true;
            user.Point += 10;
            _db.SaveChanges();
            return 0;
        }
    }
}
