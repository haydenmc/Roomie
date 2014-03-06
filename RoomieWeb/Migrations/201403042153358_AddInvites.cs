namespace RoomieWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddInvites : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.PadMates", newName: "MatePads");
            CreateTable(
                "dbo.Invites",
                c => new
                    {
                        InviteId = c.Guid(nullable: false, identity: true),
                        RecipientEmail = c.String(),
                        Pad_PadId = c.Guid(),
                        Recipient_Id = c.String(maxLength: 128),
                        Sender_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.InviteId)
                .ForeignKey("dbo.Pads", t => t.Pad_PadId)
                .ForeignKey("dbo.AspNetUsers", t => t.Recipient_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.Sender_Id)
                .Index(t => t.Pad_PadId)
                .Index(t => t.Recipient_Id)
                .Index(t => t.Sender_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Invites", "Sender_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Invites", "Recipient_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Invites", "Pad_PadId", "dbo.Pads");
            DropIndex("dbo.Invites", new[] { "Sender_Id" });
            DropIndex("dbo.Invites", new[] { "Recipient_Id" });
            DropIndex("dbo.Invites", new[] { "Pad_PadId" });
            DropTable("dbo.Invites");
            RenameTable(name: "dbo.MatePads", newName: "PadMates");
        }
    }
}
