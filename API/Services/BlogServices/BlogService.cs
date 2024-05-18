using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Hosting;

namespace API.Services.BlogServices
{
    public class BlogService : IBlogService
    {
        private readonly DataDbContext _db;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public BlogService(DataDbContext db, IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            _db = db;
        }

        public BlogInfoDto GetOne(int id)
        {
            var blog = _db.Blogs
                .Where(x => x.Id == id)
                .Select(x => new BlogInfoDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Content = x.Content,
                    Time = x.Time
                })
                .FirstOrDefault();
            if (blog == null) return null;
            return blog;
        }

        public List<BlogDto> GetAll()
        {
            var blogs = _db.Blogs.ToList();
            if (blogs.Count == 0) return null;
            var toReturn = new List<BlogDto>();
            foreach (var blog in blogs)
            {
                var item = new BlogDto
                {
                    Id = blog.Id,
                    Title = blog.Title,
                    Description = blog.Description,
                    Time = blog.Time,
                    FileUrl = GetImageUrl(blog.Filename)
                };
                toReturn.Add(item);
            }
            return toReturn;
        }
        public bool DeleteBlog(int id)
        {
            var blog = _db.Blogs.FirstOrDefault(f => f.Id == id);
            if (blog == null) return false;
            // Get the physical path to the wwwroot folder
            string webRootPath = _webHostEnvironment.WebRootPath;

            // Combine the path with the image file name
            string imagePath = Path.Combine(webRootPath, "Upload\\BlogThumbnail", blog.Filename);
            if (File.Exists(imagePath))
            {
                File.SetAttributes(imagePath, FileAttributes.Normal);
                File.Delete(imagePath);
            }
            _db.Blogs.Remove(blog);
            _db.SaveChanges();
            return true;
        }

        private string GetImageUrl(string imageName)
        {
            // Get the physical path to the wwwroot folder
            string webRootPath = _webHostEnvironment.WebRootPath;

            // Combine the path with the image file name
            string imagePath = Path.Combine(webRootPath, "Upload\\BlogThumbnail", imageName); // Assuming the images are in the "images" folder
            string hostUrl = "https://localhost:7009/";
            // Check if the image file exists
            if (System.IO.File.Exists(imagePath))
            {
                imagePath = hostUrl + "Upload/BlogThumbnail/" + imageName;
                return imagePath;
            }
            else
            {
                // Handle the case where the image file does not exist
                return "";
            }
        }
    }
}
