﻿using API.DTOs;
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

        [HttpPost("UploadImage")]
        public async Task<ActionResult> UploadImage()
        {
            bool results = false;
            try
            {
                var uploadedFiles = Request.Form.Files;
                foreach(IFormFile source in uploadedFiles)
                {
                    string fileName = source.FileName;
                    string filePath = GetFilePath(fileName);

                    if(!System.IO.Directory.Exists(filePath))
                    {
                        System.IO.Directory.CreateDirectory(filePath);
                    }

                    string imagePath = fileName + "\\image.png";

                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                    using(FileStream stream = System.IO.File.Create(imagePath))
                    {
                        await source.CopyToAsync(stream); 
                        results = true;
                    }
                }
            }
            catch(Exception ex)
            {

            }
            return Ok(results);
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

        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            if (_bookService.Delete(id))
            {
                return NoContent();
            }
            return BadRequest("Invalid book Id.");
        }
        [NonAction]
        private string GetFilePath(string productCode)
        {
            return this._webHostEnvironment.WebRootPath + "\\Uploads\\Books\\"+productCode;
        }
        [NonAction]
        private string GetImageByProduct(string productCode)
        {
            string imageUrl = string.Empty;
            string hostUrl = "https://localhost:7009/";
            string filePath = GetFilePath(productCode);
            string imagePath = filePath + "\\image.png";
            if (!System.IO.File.Exists(imagePath))
            {
                imageUrl = hostUrl + "/Uploads/Common/NoImage.png";
            }
            else
            {
                imageUrl = hostUrl + "/Uploads/Books/" + productCode + "/image.png";
            }
            return imageUrl;
        }
    }
}