using API.Data;
using API.DTOs;
using API.Entities;

namespace API.Services.CategoryServices
{
    public class CategoryService : ICategoryService
    {
        private readonly DataDbContext _db;
        public CategoryService(DataDbContext db)
        {
            _db = db;
        }
        public bool Add(CategoryAddEditDto category)
        {
            var categoryToAdd = new Category
            {
                Name = category.Name,
            };
            _db.Categories.Add(categoryToAdd);
            _db.SaveChanges();
            return true;
        }

        public bool CategoryNameExists(string categoryName)
        {
            var fetchedCategory = _db.Categories.FirstOrDefault(c => c.Name == categoryName);
            if(fetchedCategory != null)
            {
                return true;
            }
            return false;
        }

        public bool Delete(int id)
        {
            var fetchedCategory = _db.Categories.FirstOrDefault(x => x.Id == id);
            if(fetchedCategory == null) 
            {
                return false;
            }
            _db.Categories.Remove(fetchedCategory);
            _db.SaveChanges();
            return true;
        }

        public List<CategoryDto> GetAll()
        {
            return _db.Categories.Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
            }).ToList();
        }

        public CategoryDto GetById(int id)
        {
            var category = _db.Categories.FirstOrDefault(x => x.Id == id);
            if (category == null) return null;
            var toReturn = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
            return toReturn;
        }

        public CategoryDto GetByName(string name)
        {
            var category = _db.Categories.FirstOrDefault(x => x.Name.ToLower() == name.ToLower());
            if (category == null) return null;
            var toReturn = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
            return toReturn;
        }

        public bool Update(CategoryAddEditDto category)
        {
            var fetchedCategory = _db.Categories.FirstOrDefault(x => x.Id == category.Id);
            if (fetchedCategory == null)
            {
                return false;
            }
            fetchedCategory.Name = category.Name;
            _db.SaveChanges();
            return true;
        }
    }
}
