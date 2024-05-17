using API.Data;
using API.DTOs;
using API.Entities;
using API.Services.BookServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly DataDbContext _db;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public BookController(IBookService bookService, DataDbContext db, IWebHostEnvironment webHostEnvironment)
        {
            _bookService = bookService;
            _db = db;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public ActionResult<List<BookDto>> GetAll()
        {
            var books = _bookService.GetAll();
            if(books == null)
            {
                return NotFound();
            }
            return books;
        }

        

        [HttpGet("{id}")]
        public ActionResult<BookDto> GetOne(int id)
        {
            var book = _bookService.GetById(id);
            if (book == null)
            {
                return NotFound();
            }
            return book;
        }
        [HttpGet("category/{id}")]
        public ActionResult<List<BookDto>> GetBooksByCategory(int id)
        {
            var books = _bookService.GetBookByCategory(id);
            if (books == null)
            {
                return NotFound();
            }
            return books;
        }
        [HttpGet, Authorize(Roles = "Admin")]
        [Route("DownloadFile/{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            var feedback = _db.Feedbacks.FirstOrDefault(f => f.Id == id);
            if (feedback == null) return NotFound();
            var filepath = Path.Combine(_webHostEnvironment.WebRootPath, "Upload\\Books", feedback.Filename);

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filepath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(filepath);
            return File(bytes, contentType, Path.GetFileName(filepath));
        }

        [HttpPost, Authorize(Roles = "Admin")]
        [Route("UploadFileAdd")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create(BookAddEditDto book)
        {
            var fetchedCategory = _bookService.GetCategoryByName(book.Category);
            if (fetchedCategory == null)
            {
                return BadRequest("Invalid category name");
            }
            var bookToAdd = new Book
            {
                Title = book.Title,
                Code = await WriteFile(book.File),
                Description = book.Description,
                Author = book.Author,
                Language = book.Language,
                IsPrivate = book.IsPrivate,
                ImageUrl = book.ImageUrl,
                CategoryId = fetchedCategory.Id,
                Category = fetchedCategory
            };
            await _db.Books.AddAsync(bookToAdd);
            await _db.SaveChangesAsync();
            return Ok("Add a book successfully");
        }
        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "";
            if (file == null) return filename;
            try
            {
                var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                filename = DateTime.Now.Ticks.ToString() + extension;
                var filepath = Path.Combine(_webHostEnvironment.WebRootPath, "Upload\\Books");

                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }

                var exactpath = Path.Combine(_webHostEnvironment.WebRootPath, "Upload\\Books", filename);

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

        [HttpPut, Authorize(Roles = "Admin")]
        [Route("UploadFileUpdate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(BookAddEditDto book)
        {
            var fetchedBook = await _db.Books.FirstOrDefaultAsync(b => b.Id == book.Id);
            if (fetchedBook == null)
            {
                return BadRequest("Invalid book Id.");
            }
            var oldFilename = fetchedBook.Code;
            var fetchedCategory = _bookService.GetCategoryByName(book.Category);
            if (fetchedCategory == null)
            {
                return BadRequest("Invalid category name");
            }
            fetchedBook.Title = book.Title;
            fetchedBook.Code = book.File != null ? await WriteFile(book.File) : fetchedBook.Code;
            fetchedBook.Description = book.Description;
            fetchedBook.Author = book.Author;
            fetchedBook.Language = book.Language;
            fetchedBook.IsPrivate = book.IsPrivate;
            fetchedBook.ImageUrl = book.ImageUrl;
            fetchedBook.CategoryId = fetchedCategory.Id;
            Console.WriteLine(oldFilename);
            await _db.SaveChangesAsync();
            _bookService.DeleteOldFilename(oldFilename);
            return Ok("Update a book successfully.");
        }

        [HttpPut("downloadingbook"), Authorize(Roles = "User")]
        public IActionResult AddDownloadedBookTotal(FavouriteBookDto model)
        {
            var result = _bookService.AddDownloadedBook(model);
            switch (result)
            {
                case 0:
                    return NotFound("Book was not found");
                case 1:
                    return NotFound("User was not found");
                case 3:
                    return BadRequest("User is out of points");
                case 2:
                    return NoContent();
                default:
                    return BadRequest();
            }
        }

        [HttpPut("readingbook={id}")]
        public IActionResult AddWatchedBookTotal(int id)
        {
            var result = _bookService.AddWatchedBook(id);
            if(result)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            if (_bookService.Delete(id))
            {
                return NoContent();
            }
            return BadRequest("Invalid book Id.");
        }
        
    }
}
