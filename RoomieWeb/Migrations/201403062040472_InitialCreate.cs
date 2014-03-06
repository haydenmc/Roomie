namespace RoomieWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
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
            
            CreateTable(
                "dbo.Pads",
                c => new
                    {
                        PadId = c.Guid(nullable: false, identity: true),
                        StreetAddress = c.String(),
                        ZipCode = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PadId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UserName = c.String(),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        Email = c.String(),
                        DisplayName = c.String(),
                        JoinTime = c.DateTime(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        User_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.LoginProvider, t.ProviderKey })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Messages",
                c => new
                    {
                        MessageId = c.Guid(nullable: false, identity: true),
                        Body = c.String(),
                        SendTime = c.DateTime(nullable: false),
                        Author_Id = c.String(maxLength: 128),
                        Pad_PadId = c.Guid(),
                    })
                .PrimaryKey(t => t.MessageId)
                .ForeignKey("dbo.AspNetUsers", t => t.Author_Id)
                .ForeignKey("dbo.Pads", t => t.Pad_PadId)
                .Index(t => t.Author_Id)
                .Index(t => t.Pad_PadId);
            
            CreateTable(
                "dbo.MatePads",
                c => new
                    {
                        Mate_Id = c.String(nullable: false, maxLength: 128),
                        Pad_PadId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Mate_Id, t.Pad_PadId })
                .ForeignKey("dbo.AspNetUsers", t => t.Mate_Id, cascadeDelete: true)
                .ForeignKey("dbo.Pads", t => t.Pad_PadId, cascadeDelete: true)
                .Index(t => t.Mate_Id)
                .Index(t => t.Pad_PadId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Invites", "Sender_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Invites", "Recipient_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Invites", "Pad_PadId", "dbo.Pads");
            DropForeignKey("dbo.Messages", "Pad_PadId", "dbo.Pads");
            DropForeignKey("dbo.Messages", "Author_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.MatePads", "Pad_PadId", "dbo.Pads");
            DropForeignKey("dbo.MatePads", "Mate_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Invites", new[] { "Sender_Id" });
            DropIndex("dbo.Invites", new[] { "Recipient_Id" });
            DropIndex("dbo.Invites", new[] { "Pad_PadId" });
            DropIndex("dbo.Messages", new[] { "Pad_PadId" });
            DropIndex("dbo.Messages", new[] { "Author_Id" });
            DropIndex("dbo.MatePads", new[] { "Pad_PadId" });
            DropIndex("dbo.MatePads", new[] { "Mate_Id" });
            DropIndex("dbo.AspNetUserClaims", new[] { "User_Id" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropTable("dbo.MatePads");
            DropTable("dbo.Messages");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Pads");
            DropTable("dbo.Invites");
        }
    }
}
