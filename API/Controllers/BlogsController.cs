using API.Data;
using API.DTOs;
using API.Entities;
using API.Services.BlogServices;
using API.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IBlogService _blogService;
        private readonly DataDbContext _db;
        public BlogsController(IWebHostEnvironment webHostEnvironment, IBlogService blogService, DataDbContext db)
        {
            _webHostEnvironment = webHostEnvironment;
            _blogService = blogService;
            _db = db;
        }
        // GET: api/<BlogsController>
        [HttpGet]
        public ActionResult<List<BlogDto>> GetAll()
        {
            var blogs = _blogService.GetAll();
            if (blogs == null) return NotFound();
            return Ok(blogs);
        }
        [HttpGet("{id}")]
        public ActionResult<BlogInfoDto> GetOne(int id)
        {
            var blog = _blogService.GetOne(id);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        [HttpPost, Authorize(Roles = "Admin")]
        [Route("UploadFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadFile(BlogToAddDto model)
        {
            var blog = new Blog
            {
                Title = model.Title,
                Description = model.Description,
                Content = model.Content,
                Time = model.Time,
                Filename = await WriteFile(model.File)
            };
            await _db.Blogs.AddAsync(blog);
            await _db.SaveChangesAsync();
            return Ok("Add a blog successfully");
        }
        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "";
            if (file == null) return filename;
            try
            {
                var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                filename = DateTime.Now.Ticks.ToString() + extension;
                string webRootPath = _webHostEnvironment.WebRootPath;
                string filepath = Path.Combine(webRootPath, "Upload\\BlogThumbnail");

                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }

                var exactpath = Path.Combine(_webHostEnvironment.WebRootPath, "Upload\\BlogThumbnail", filename);

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
        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public ActionResult Delete(int id)
        {
            if (!_blogService.DeleteBlog(id))
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
