using API.Data;

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
                    return _db.FavouriteBooks.Count();
                case 4:
                    return _db.WatchedBooks.Count();
                case 5:
                    return _db.Comments.Count();
                case 6:
                    return _db.Categories.Count();
                default:
                    return 0;
            }
        }
    }
}
