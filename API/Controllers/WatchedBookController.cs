using API.DTOs;
using API.Services.BookServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchedBookController : ControllerBase
    {
        private readonly IBookService _bookService;
        public WatchedBookController(IBookService bookService)
        {
            _bookService = bookService;
        }
        // GET api/<WatchedBookController>/5
        [HttpGet("{email}"), Authorize(Roles = "User")]
        public ActionResult<List<WatchedBookDto>> GetAll(string email)
        {
            var books = _bookService.GetWatchedBookId(email);
            if (books == null)
            {
                return NotFound();
            }
            var toReturn = new List<WatchedBookDto>();
            foreach (var bookId in books)
            {
                var item = _bookService.GetWatchedBook(bookId);
                if (item != null)
                {
                    toReturn.Add(item);
                }
            }
            return toReturn;
        }

        // POST api/<WatchedBookController>
        [HttpPost, Authorize(Roles = "User")]
        public ActionResult Add(FavouriteBookDto model)
        {
            int result = _bookService.AddWatchedBook(model.BookId, model.Email);
            switch (result)
            {
                case 1:
                    return NotFound("Book was not found");
                case 2:
                    return NotFound("User was not found");
                case 3:
                    return Content("Update a watched book.");
                case 4:
                    return Content("Add a watched book.");
                default:
                    return BadRequest();
            }
        }
    }
}
