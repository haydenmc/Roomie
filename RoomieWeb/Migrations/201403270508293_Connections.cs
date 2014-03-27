namespace RoomieWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Connections : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.MatePads", newName: "PadMates");
            CreateTable(
                "dbo.Connections",
                c => new
                    {
                        connectionId = c.String(nullable: false, maxLength: 128),
                        UserAgent = c.String(),
                        StartTime = c.DateTimeOffset(nullable: false, precision: 7),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.connectionId)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.User_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Connections", "User_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Connections", new[] { "User_Id" });
            DropTable("dbo.Connections");
            RenameTable(name: "dbo.PadMates", newName: "MatePads");
        }
    }
}
