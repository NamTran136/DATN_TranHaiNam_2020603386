using API.DTOs;
using API.Services.CommentServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }
        // GET: api/<CommentsController>
        [HttpGet, Authorize(Roles = "Admin")]
        public ActionResult<List<CommentDto>> GetAll()
        {
            var comments = _commentService.GetAll();
            if(comments.Count == 0)
            {
                return NotFound();
            }
            return Ok(comments);
        }

        // GET api/<CommentsController>/5
        [HttpGet("{id}")]
        public ActionResult<CommentDto> GetOne(int id)
        {
            var comment = _commentService.GetOne(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }
        [HttpGet("book={id}")]
        public ActionResult<CommentDto> GetByBook(int id)
        {
            var comment = _commentService.GetByBook(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        // POST api/<CommentsController>
        [HttpPost, Authorize(Roles = "User")]
        public IActionResult Post(CommentAddOrEditDto comment)
        {
            if(_commentService.Add(comment) == 1)
            {
                return BadRequest("Email user is not valid.");
            }
            return Ok("Add comment successfully");
        }

        // DELETE api/<CommentsController>/5
        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            if(!_commentService.Delete(id))
            {
                return NotFound();
            }
            return Ok("Delete comment successfully");
        }
    }
}
