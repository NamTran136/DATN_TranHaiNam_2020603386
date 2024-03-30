using API.DTOs;

namespace API.Services.CategoryServices
{
    public interface ICategoryService
    {
        bool CategoryNameExists(string categoryName);
        bool Add(CategoryAddEditDto category);
        bool Update(CategoryAddEditDto category);
        List<CategoryDto> GetAll();
        CategoryDto GetById(int id);
        CategoryDto GetByName(string name);
        bool Delete(int id);
    }
}
