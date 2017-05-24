using System.Collections.Generic;

namespace Server
{
    public interface ICharacterRepository
    {
        Character AddNewCharacter(Character character);
        List<Character> GetAllCharactersWithOwnerId(int _ownerId);
        List<Character> GetCharacterById(int _id);
    }

    public class Character
    {
        public int Id;
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public string Appearance { get; set; }
        public string Clothing { get; set; }
        public string HairAndMakeup { get; set; }
    }
}
