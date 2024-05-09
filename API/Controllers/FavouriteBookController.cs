using API.DTOs;
using API.Services.BookServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavouriteBookController : ControllerBase
    {
        private readonly IBookService _bookService;
        public FavouriteBookController(IBookService bookService)
        {
            _bookService = bookService;
        }
        // GET: api/<FavouriteBookController>
        [HttpGet, Authorize(Roles = "User")]
        public ActionResult<List<BookDto>> GetAll(string email)
        {
            var books = _bookService.GetFavouriteBookId(email);
            if (books == null)
            {
                return NotFound();
            }
            var toReturn = new List<BookDto>();
            foreach (var bookId in books)
            {
                var item = _bookService.GetById(bookId);
                if (item != null)
                {
                    toReturn.Add(item);
                }
            }
            return toReturn;
        }

        // GET api/<FavouriteBookController>/5
        [HttpGet("{id}")]
        public int Count(int id)
        {
            return _bookService.FavouriteBookTotal(id);
        }
        [HttpGet("bookId={bookId}/email={email}")]
        public bool Check(int bookId, string email)
        {
            return _bookService.CheckFavouriteBook(bookId, email);
        }


        // POST api/<FavouriteBookController>
        [HttpPost, Authorize(Roles = "User")]
        public ActionResult Add(FavouriteBookDto model)
        {
            int result = _bookService.AddFavouriteBook(model.BookId, model.Email);
            switch(result)
            {
                case 1:
                    return NotFound("Book was not found");
                case 2:
                    return NotFound("User was not found");
                case 3:
                    return BadRequest("Favourite Book exists");
                case 4:
                    return NoContent();
               default:
                    return BadRequest();
            }
        }

        // DELETE api/<FavouriteBookController>/5
        [HttpDelete("bookId={bookId}/email={email}"), Authorize(Roles = "User")]
        public ActionResult Delete(string email, int bookId)
        {
            if(_bookService.RemoveFavouriteBook(bookId, email))
            {
                return NoContent();
            }
            return NotFound();
        }
    }
}
