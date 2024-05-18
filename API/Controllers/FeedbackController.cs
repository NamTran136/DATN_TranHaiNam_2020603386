using API.Data;
using API.DTOs;
using API.Entities;
using API.Services.FeedbackServices;
using API.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IFeedbackService _feedbackService;
        private readonly DataDbContext _db;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public FeedbackController(IUserService userService, IFeedbackService feedbackService, DataDbContext db, IWebHostEnvironment webHostEnvironment)
        {
            _userService = userService;
            _feedbackService = feedbackService;
            _db = db;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet, Authorize(Roles = "Admin")]
        public ActionResult<List<FeedbackDto>> GetAll()
        {
            var feedbacks = _feedbackService.GetAll();
            if (feedbacks == null) return NotFound();
            return Ok(feedbacks);
        }
        [HttpGet("{id}"), Authorize(Roles = "Admin")]
        public ActionResult<FeedbackDto> GetOne(int id)
        {
            var feedback = _feedbackService.GetOne(id);
            if (feedback == null) return NotFound();
            return Ok(feedback);
        }

        [HttpPost]
        [Route("UploadFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadFile(FeedbackToAddDto model)
        {
            var fetchedUser = _userService.GetByEmail(model.Email);
            if (fetchedUser == null)
            {
                return NotFound("User was not found");
            }
            var feedback = new Feedback
            {
                UserId = fetchedUser.Id,
                Title = model.Title,
                Content = model.Content,
                CreatedAt = DateTime.Now,
                Filename = await WriteFile(model.File)
            };
            await _db.Feedbacks.AddAsync(feedback);
            await _db.SaveChangesAsync();
            return Ok("Add a feedback successfully");
        }
        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "";
            if (file == null) return filename;
            try
            {
                var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                filename = DateTime.Now.Ticks.ToString() + extension;
                var filepath = Path.Combine(_webHostEnvironment.WebRootPath, "Upload\\Feedbacks");

                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }

                var exactpath = Path.Combine(_webHostEnvironment.WebRootPath, "Upload\\Feedbacks", filename);

                using (var stream = new FileStream(exactpath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            return filename;
        }

        [HttpGet, Authorize(Roles = "Admin")]
        [Route("DownloadFile/{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            var feedback = _db.Feedbacks.FirstOrDefault(f => f.Id == id);
            if (feedback == null) return NotFound();
            var filepath = Path.Combine(_webHostEnvironment.WebRootPath, "Upload\\Feedbacks", feedback.Filename);

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filepath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(filepath);
            return File(bytes, contentType, Path.GetFileName(filepath));
        }

        [HttpPut("{id}"), Authorize(Roles = "Admin")]
        public ActionResult ActiveFeedback(int id)
        {
            var result = _feedbackService.ActiveFeedback(id);
            switch(result)
            {
                case 0:
                    return NoContent();
                case 1:
                    return NotFound("Feedback was not found");
                case 2:
                    return NotFound("User was not found");
                default:
                    return BadRequest();
            }
        }

        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public ActionResult Delete(int id)
        {
            if (!_feedbackService.DeleteFeedback(id))
            {
                return NotFound();
            }
            return NoContent();
        }
    }


}
