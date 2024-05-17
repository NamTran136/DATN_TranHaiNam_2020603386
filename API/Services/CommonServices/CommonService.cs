using API.Data;
using API.DTOs;
using API.Entities;
using System.Globalization;
using System.Text;

namespace API.Services.CommonServices
{
    public class CommonService : ICommonService
    {
        private readonly DataDbContext _db;
        public CommonService(DataDbContext db)
        {
            _db = db;
        }
        public int Count(int select)
        {
            switch (select)
            {
                case 1:
                    return _db.Books.Count();
                case 2:
                    return _db.Users.Count();
                case 3:
                    return _db.Books.Sum(book => book.NumOfDownloads);
                case 4:
                    return _db.Books.Sum(book => book.NumOfViews);
                case 5:
                    return _db.Comments.Count();
                case 6:
                    return _db.Categories.Count();
                case 7:
                    return _db.Blogs.Count();
                default:
                    return 0;
            }
        }

        public List<BookDto> SearchBook(string input, int index)
        {
            string normalizedInput = RemoveDiacritics(input).ToLower();
            var books = new List<Book>();
            var toReturn = new List<BookDto>();
            switch (index)
            {
                case 1:
                    var book = _db.Books.FirstOrDefault(b => b.Id == ConvertStringToInt(input));
                    if (book == null) return null;
                    var item = new BookDto
                    {
                        Id = book.Id,
                        Title = book.Title,
                        Code = book.Code,
                        Description = book.Description,
                        Author = book.Author,
                        Language = book.Language,
                        CategoryId = book.CategoryId,
                        ImageUrl = book.ImageUrl,
                        NumOfDownloads = book.NumOfDownloads,
                        NumOfViews = book.NumOfViews,
                        IsPrivate = book.IsPrivate,
                        Category = _db.Categories.Find(book.CategoryId).Name
                    };
                    toReturn.Add(item);
                    return toReturn;
                case 2:
                    books = _db.Books.ToList();
                    foreach (var book2 in books)
                    {
                        string normalizedTitle = RemoveDiacritics(book2.Title).ToLower();
                        if(normalizedTitle.Contains(normalizedInput))
                        {
                            var item2 = new BookDto
                            {
                                Id = book2.Id,
                                Title = book2.Title,
                                Code = book2.Code,
                                Description = book2.Description,
                                Author = book2.Author,
                                Language = book2.Language,
                                CategoryId = book2.CategoryId,
                                ImageUrl = book2.ImageUrl,
                                NumOfDownloads = book2.NumOfDownloads,
                                NumOfViews = book2.NumOfViews,
                                IsPrivate = book2.IsPrivate,
                                Category = _db.Categories.Find(book2.CategoryId).Name
                            };
                            toReturn.Add(item2);
                        }
                    }
                    return toReturn;
                case 3:
                    books = _db.Books.ToList();
                    foreach (var book2 in books)
                    {
                        string normalizedAuthor = RemoveDiacritics(book2.Author).ToLower();
                        if (normalizedAuthor.Contains(normalizedInput))
                        {
                            var item2 = new BookDto
                            {
                                Id = book2.Id,
                                Title = book2.Title,
                                Code = book2.Code,
                                Description = book2.Description,
                                Author = book2.Author,
                                Language = book2.Language,
                                CategoryId = book2.CategoryId,
                                ImageUrl = book2.ImageUrl,
                                NumOfDownloads = book2.NumOfDownloads,
                                NumOfViews = book2.NumOfViews,
                                IsPrivate = book2.IsPrivate,
                                Category = _db.Categories.Find(book2.CategoryId).Name
                            };
                            toReturn.Add(item2);
                        }
                    }
                    return toReturn;
                case 4:
                    var categories = new List<CategoryDto>();
                    foreach(var category in _db.Categories.ToList())
                    {
                        string normalizedName = RemoveDiacritics(category.Name).ToLower();
                        if (normalizedName.Contains(normalizedInput))
                        {
                            var cate = new CategoryDto
                            {
                                Id = category.Id,
                                Name = category.Name,
                            };
                            categories.Add(cate);
                        }
                    }
                    foreach (var book2 in _db.Books)
                    {
                        if(categories.Any(item => item.Id == book2.CategoryId))
                        {
                            var item2 = new BookDto
                            {
                                Id = book2.Id,
                                Title = book2.Title,
                                Code = book2.Code,
                                Description = book2.Description,
                                Author = book2.Author,
                                Language = book2.Language,
                                CategoryId = book2.CategoryId,
                                ImageUrl = book2.ImageUrl,
                                NumOfDownloads = book2.NumOfDownloads,
                                NumOfViews = book2.NumOfViews,
                                IsPrivate = book2.IsPrivate,
                                Category = _db.Categories.Find(book2.CategoryId).Name
                            };
                            toReturn.Add(item2);
                        }
                    }
                    return toReturn;
                default:
                    return null;
            }
        }

        public List<PublicUserDto> SearchUser(string input, int index)
        {
            string normalizedInput = RemoveDiacritics(input).ToLower();
            var users = new List<User>();
            var toReturn = new List<PublicUserDto>();
            switch(index)
            {
                case 2:
                    users = _db.Users.Where(b => b.Email.Contains(input)).ToList();
                    if (users == null) return null;
                    foreach(var user in users)
                    {
                        var item = new PublicUserDto
                        {
                            Id = user.Id,
                            Username = user.Username,
                            Email = user.Email,
                            ImageUrl = user.ImageUrl
                        };
                        toReturn.Add(item);
                    }
                    return toReturn;
                case 1:
                    users = _db.Users.ToList();
                    foreach (var user in users)
                    {
                        string normalizedUsername = RemoveDiacritics(user.Username).ToLower();
                        if (normalizedUsername.Contains(normalizedInput))
                        {
                            var item = new PublicUserDto
                            {
                                Id = user.Id,
                                Username = user.Username,
                                Email = user.Email,
                                ImageUrl = user.ImageUrl
                            };
                            toReturn.Add(item);
                        }
                    }
                    return toReturn;
                default:
                    return null;
            }
        }

            public List<CategoryDto> GetTopCategories()
        {
            var cateIds = _db.Books.GroupBy(book => book.CategoryId)
            .Select(group => new
            {
                CateId = group.Key,
                Count = group.Count()
            })
            .OrderByDescending(x => x.Count)
            .Take(5)
            .Select(x => x.CateId)
            .ToList();
            if (cateIds.Count == 0) return null;
            var toReturn = new List<CategoryDto>();
            foreach(var id in cateIds)
            {
                var category = _db.Categories.FirstOrDefault(c => c.Id == id);
                if(category != null)
                {
                    var item = new CategoryDto
                    {
                        Id = category.Id,
                        Name = category.Name
                    };
                    toReturn.Add(item);
                }
            }
            return toReturn;
        }
        private int ConvertStringToInt(string input)
        {
            if (int.TryParse(input, out int result))
            {
                return result;
            }
            return 0;
        }
        private string RemoveDiacritics(string s)
        {
            return string.Concat(s.Normalize(NormalizationForm.FormD).Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)).Normalize(NormalizationForm.FormC);
        }
    }
}
