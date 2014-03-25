namespace RoomieWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DateTimeOffset : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AspNetUsers", "JoinTime", c => c.DateTimeOffset(precision: 7));
            AlterColumn("dbo.Messages", "SendTime", c => c.DateTimeOffset(nullable: false, precision: 7));
            AlterColumn("dbo.RefreshTokens", "IssuedTime", c => c.DateTimeOffset(nullable: false, precision: 7));
            AlterColumn("dbo.RefreshTokens", "ExpiresTime", c => c.DateTimeOffset(nullable: false, precision: 7));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.RefreshTokens", "ExpiresTime", c => c.DateTime(nullable: false));
            AlterColumn("dbo.RefreshTokens", "IssuedTime", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Messages", "SendTime", c => c.DateTime(nullable: false));
            AlterColumn("dbo.AspNetUsers", "JoinTime", c => c.DateTime());
        }
    }
}
