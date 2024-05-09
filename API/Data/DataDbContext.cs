using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataDbContext : DbContext
    {
        public DataDbContext(DbContextOptions<DataDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<FavouriteBook> FavouriteBooks { get; set; }
        public DbSet<WatchedBook> WatchedBooks { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FavouriteBook>()
                .HasKey(x => new { x.UserId, x.BookId });

            modelBuilder.Entity<User>()
                .HasMany(x => x.FavouriteBooks)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Book>()
                .HasMany(x => x.FavouriteBooks)
                .WithOne(x => x.Book)
                .HasForeignKey(x => x.BookId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WatchedBook>()
                .HasKey(x => new { x.UserId, x.BookId });

            modelBuilder.Entity<User>()
                .HasMany(x => x.WatchedBooks)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Book>()
                .HasMany(x => x.WatchedBooks)
                .WithOne(x => x.Book)
                .HasForeignKey(x => x.BookId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
