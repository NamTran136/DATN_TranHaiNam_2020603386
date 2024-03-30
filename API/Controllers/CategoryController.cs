using API.DTOs;
using API.Services.CategoryServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService) 
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _categoryService.GetAll();
            if(categories.Count == 0)
            {
                return NotFound();
            }
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetOne(int id)
        {
            var category = _categoryService.GetById(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpGet("/name/{name}")]
        public IActionResult GetByName(string name)
        {
            var category = _categoryService.GetByName(name);
            if(category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost, Authorize(Roles = "Admin")]
        public IActionResult Create(CategoryAddEditDto model)
        {
            if (_categoryService.CategoryNameExists(model.Name))
            {
                return BadRequest("Name category should be unique.");
            }
            if(_categoryService.Add(model))
            {
                return NoContent();
            }
            return BadRequest("Something seems to have gone wrong.");
        }

        [HttpPut, Authorize(Roles = "Admin")]
        public IActionResult Update(CategoryAddEditDto model)
        {
            var fetchedCategory = _categoryService.GetById(model.Id);
            if (_categoryService.CategoryNameExists(model.Name) && fetchedCategory.Name != model.Name)
            {
                return BadRequest("Name category should be unique.");
            }
            if (_categoryService.Update(model))
            {
                return NoContent();
            }
            else
            {
                return BadRequest("Invalid category Id.");
            }       
        }

        [HttpDelete, Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            if (_categoryService.Delete(id))
            {
                return NoContent();
            }
            return BadRequest("Invalid category Id.");
        }
    }
}
