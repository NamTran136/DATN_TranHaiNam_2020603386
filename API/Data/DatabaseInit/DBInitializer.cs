using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace API.Data.DatabaseInit
{
    public class DBInitializer
    {
        public static async Task InitializeAsync(DataDbContext db)
        {
            if (db.Database.GetPendingMigrations().Count() > 0)
            {
                await db.Database.MigrateAsync();
            }
            if(!db.Users.Any())
            {
                byte[] passwordHash, passwordSalt;
                using (var hmac = new HMACSHA512())
                {
                    passwordSalt = hmac.Key;
                    passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("123456"));
                }
                var admin = new User
                {
                    Username = "Admin",
                    Email = "admin123@gmail.com",
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    IsAdmin = true,
                    Point = 1000000
                };
                db.Users.Add(admin);
            }
            // Category Seeding
            var category1 = new Category
            {
                Name = "Cổ tích - Thần thoại"
            };
            var category2 = new Category
            {
                Name = "Trinh thám - Hình sự"
            };
            if (!db.Categories.Any())
            {
                db.Categories.Add(category1);
                db.Categories.Add(category2);
            }
            // Book Seeding
            var book1 = new Book
            {
                Code = "1uLbxLOXOBDBZIkxBGNY5gYIG9WlOBoNI",
                Title = "Kho tàng truyện cổ tích Việt Nam",
                Description = "KHO TÀNG TRUYỆN CỔ TÍCH VIỆT NAM,kể từ lần in thứ bảy, in cùng lúc trọn bộ cả năm tập. Rất tiếc, ở những lần in toàn vẹn này tác giả đã không còn được tự mình xem lại bản in thử, như ông đã từng làm việc đó một cách hứng thú và kiên trì trong sáu lần in lẻ tẻ từng tập trước đây. \n Tuy nhiên, từ sau khi tập V ra mắt (1982), thân phụ chúng tôi đã có dịp chỉnh lý kỹ cả năm tập, nhất là phần Tổng luận, nhằm chuẩn bị cho một lần in đầy đủ sau này. Chúng tôi cố gắng trung thành với những sửa chữa trực tiếp của ông, kể cả một đôi chỗ ông ủy thác cho tôi soát lại chút ít ít câu chữ, trong khi đọc bộ sách. Mặt khác, trong lần in thứ tư (1972), tác giả có một thay đổi đáng kể trong kết cấu cuốn sách của mình: ông bỏ đi 2 truyện và thay bằng 2 truyện khác để giữ nguyên số lượng 200 truyện. \n Cân nhắc kỹ lại trong lần in thứ bảy, chúng tôi đã mạnh dạn đưa một truyện trong số đó trở lại bộ sách: truyện Giết chó khuyên chồng, số 50. Để bạn đọc dễ nhận ra truyện này đã được bỏ đi, chúng tôi đặt chữ số 50 đứng đầu tên truyện trong dấu [ ]. Tôn trọng ý nguyện của tác giả, các quy tắc viết hoa và phiên âm tên người, tên đất vẫn giữ nguyên như trong mấy lần in trước chứ không thay đổi. Tuy vậy, để giúp các nhà nghiên cứu có thể tra tìm nhanh chóng khối lượng tài liệu nước ngoài hết sức lớn mà tác giả đã tham khảo, ở các chú thích xuất xứ, bên cạnh tên người phiên âm trước đây chúng tôi có ký chú thêm nguyên văn, hoặc chuyển ngữ tiếng Pháp. Đối với tên một số dân tộc, hay một số địa danh trên thế giới được nhắc đến trong mục Khảo dị, nếu thấy cần thiết, chúng tôi cũng làm như vậy. Cuối bộ sách, chúng tôi còn thêm vào một Bảng tra cứu tên truyện sắp xếp theo trật tự a b c. Tất cả những việc này đều do các bạn bè thân thiết trong Ban văn học Cổ cận đại Viện Văn học góp sức thực hiện vào năm 1992.",
                Author = "Nguyễn Đổng Chi",
                IsPrivate = true,
                Language = "Tiếng Việt",
                Category = category1
            };
            var book2 = new Book
            {
                Code = "1107DWKuefMtGiprZpO4eAFk5wc5nggvV",
                Title = "Thần Thoại Hy Lạp",
                Description = "\"Thần thoại Hy Lạp\" bao gồm các truyền thuyết về các vị thần và các vị anh hùng của người Hy Lạp. Bộ sách này hình thành trong một quãng thời gian lịch sử khá dài. Đó là một quá trình lịch sử từ thời kỳ nền văn minh Mycènes (2000 – 1100 TCN) đến những buổi biển diễn, đọc, kể anh hùng ca của Homère trong những ngày hội rồi đến hội diễn bi kịch trong ngày hội Dionysos. \n Dù hôm nay, thời đại của niềm tin và tư duy thần thoại đã lùi vào quá khứ, cung điện Olympie của các vị thần hẳn đã dời đến một hành tinh nào khác xa xăm, thì những cái tên như Zeus, Éros, Héraclès… hay Achille vẫn truyền cho loài người những âm hưởng thánh thần để chinh phục ngày mai. \n Hầu hết những câu chuyện thần thoại còn lại với độc giả ngày nay đều do những nhà thơ, nhà viết kịch kể lại… Quá trình kể lại cũng đồng thời là quá trình sắp xếp, biên soạn lại, tái tạo các câu chuyện theo một khuynh hướng nào đó.",
                Author = "Nguyễn Văn Khoả",
                IsPrivate = false,
                Language = "Tiếng Việt",
                Category = category1
            };
            var book3 = new Book
            {
                Code = "1Mulu-wFMeU0w9Wf6ZdEbCjZRp4cclKWj",
                Title = "Truyện cổ Andersen",
                Description = "Nhà văn Hans Christian Andersen (1805 – 1875) có lẽ là một hiện tượng văn học hiếm có trên thế giới.. Andersen viết du ký, kịch, tiểu thuyết, làm thơ, nhưng nổi nhất là truyện. Truyện của ông dựa vào truyện dân gian, truyền thuyết, lịch sử, đời sống hàng ngày và cả cuộc đời riêng của tác giả.",
                Author = "Hans Christian Andersen",
                IsPrivate = false,
                Language = "Tiếng Việt",
                Category = category1
            };
            var book4 = new Book
            {
                Code = "1uNeljDbwovIclisx5f49EvftD3kustlg",
                Title = "Sự im lặng của bầy cừu",
                Description = "Vụ án giết người hàng loạt xảy ra nhưng không để lại dấu vết. Điều kỳ lạ là Lecter – một bác sĩ tâm lý bị tâm thần đang điều trị tại Dưỡng Trí Viện biết rất rõ về hành vi của kẻ sát nhân nhưng chỉ im lặng. Cho đến khi con gái của thượng nghị sĩ bị bắt cóc thì cuộc đối đầu của nữ nhân viên thực tập FBI và vị bác sĩ tâm thần đã đến cực điểm. Cuối cùng tất cả cũng đều lộ diên, thủ phạm là một tên có nhân cách bệnh hoạn, một kẻ tâm thần rối loạn cựu kỳ nguy hiểm…",
                Author = "Thomas Harris",
                IsPrivate = true,
                Language = "Tiếng Việt",
                Category = category2
            };
            if (!db.Books.Any())
            {
                db.Books.Add(book1);
                db.Books.Add(book2);
                db.Books.Add(book3);
                db.Books.Add(book4);
            }
            if (db.ChangeTracker.HasChanges())
            {
                await db.SaveChangesAsync();
            }
        }
    }
}
