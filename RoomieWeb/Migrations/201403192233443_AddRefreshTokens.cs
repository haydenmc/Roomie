namespace RoomieWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRefreshTokens : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.RefreshTokens",
                c => new
                    {
                        RefreshTokenId = c.Guid(nullable: false, identity: true),
                        IssuedTime = c.DateTime(nullable: false),
                        ExpiresTime = c.DateTime(nullable: false),
                        Mate_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.RefreshTokenId)
                .ForeignKey("dbo.AspNetUsers", t => t.Mate_Id)
                .Index(t => t.Mate_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.RefreshTokens", "Mate_Id", "dbo.AspNetUsers");
            DropIndex("dbo.RefreshTokens", new[] { "Mate_Id" });
            DropTable("dbo.RefreshTokens");
        }
    }
}
