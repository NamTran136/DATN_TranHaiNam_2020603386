using API.DTOs;

namespace API.Services.FeedbackServices
{
    public interface IFeedbackService
    {
        List<FeedbackDto> GetAll();
        bool DeleteFeedback(int id);
        int ActiveFeedback(int id);
        FeedbackDto GetOne(int id);
    }
}
