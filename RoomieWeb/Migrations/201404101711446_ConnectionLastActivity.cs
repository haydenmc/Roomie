namespace RoomieWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ConnectionLastActivity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Connections", "LastActivity", c => c.DateTimeOffset(nullable: false, precision: 7));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Connections", "LastActivity");
        }
    }
}
