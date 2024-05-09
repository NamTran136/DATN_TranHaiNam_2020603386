using API.DTOs;
using API.Entities;
using API.Services.BookServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public BookController(IBookService bookService, IWebHostEnvironment webHostEnvironment)
        {
            _bookService = bookService;
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

        [HttpPost, Authorize(Roles = "Admin")]
        public IActionResult Create(BookAddEditDto model)
        {
            if (_bookService.CodeBookExists(model.Code))
            {
                return BadRequest("Code Book should be unique.");
            }
            var fetchedCategory = _bookService.GetCategoryByName(model.Category);
            if (fetchedCategory == null)
            {
                return BadRequest("Invalid category name");
            }
            if (_bookService.Add(model))
            {
                return NoContent();
            }
            return BadRequest("Something seems to have gone wrong.");
        }

        [HttpPost("pagination")]
        public ActionResult<List<BookDto>> GetByPage(PaginationDto param)
        {
            var books = _bookService.GetByPage(param);
            if (books == null)
            {
                return NotFound();
            }
            return books;
        }

        [HttpPut, Authorize(Roles = "Admin")]
        public IActionResult Update(BookAddEditDto model)
        {
            var fetchedBook = _bookService.GetById(model.Id);
            if (fetchedBook == null)
            {
                return BadRequest("Invalid book Id.");
            }
            if (_bookService.CodeBookExists(model.Code) && model.Code != fetchedBook.Code)
            {
                return BadRequest("Code Book should be unique.");
            }
            var fetchedCategory = _bookService.GetCategoryByName(model.Category);
            if (fetchedCategory == null)
            {
                return BadRequest("Invalid category name");
            }
            if (_bookService.Update(model))
            {
                return NoContent();
            }
            return BadRequest("Something seems to have gone wrong.");
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
