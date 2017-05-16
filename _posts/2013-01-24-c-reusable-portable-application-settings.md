---
layout: post
title: C# - Reusable Portable Application Settings
date: 2013-01-24 00:19 -05:00
type: post
categories:
- C#
- Programming
tags:
- .NET
- C#
---

Anybody who has worked with the .NET Framework has likely dealt with the native configuration files, especially if you're using something as intuitive as Visual Studio. While the native functionality is pretty nifty, there's still one small gripe myself and many other developers have. The .NET Framework is designed in a way that applications are to interface with a single configuration file whose location is found somewhere between AppData and obscurity. The reason for this design, according to Microsoft, was to alleviate the possibility of overwrite collisions between different applications. Despite being asked to allow developers to manage their own relative configuration paths, Microsoft has stood by this design. It's quite an annoying "feature", but there are workarounds, albeit tedious. This [article](http://www.geek-republic.com/2010/11/c-portable-settings-provider) provides a good bit of insight on how to tackle something like this. by inheriting the [SettingsProvider](http://msdn.microsoft.com/en-us/library/system.configuration.settingsprovider.aspx) class.

{% highlight csharp %}
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Text;
using Microsoft.Win32;
using System.Xml;
using System.Xml.Serialization;
 
public class PortableSettingsProvider : SettingsProvider
{
    // Define some static strings later used in our XML creation
    // XML Root node
    const string XMLROOT = "configuration";
 
    // Configuration declaration node
    const string CONFIGNODE = "configSections";
 
    // Configuration section group declaration node
    const string GROUPNODE = "sectionGroup";
 
    // User section node
    const string USERNODE = "userSettings";
 
    // Application Specific Node
    string APPNODE = System.Reflection.Assembly.GetExecutingAssembly().GetName().Name + ".Properties.Settings";
 
    private System.Xml.XmlDocument xmlDoc = null;
 
 
 
    // Override the Initialize method
    public override void Initialize(string name, NameValueCollection config)
    {
        base.Initialize(this.ApplicationName, config);
    }
 
    // Override the ApplicationName property, returning the solution name.  No need to set anything, we just need to
    // retrieve information, though the set method still needs to be defined.
    public override string ApplicationName
    {
        get
        {
            return (System.Reflection.Assembly.GetExecutingAssembly().GetName().Name);
        }
        set
        {
            return;
        }
    }
 
    // Simply returns the name of the settings file, which is the solution name plus ".config"
    public virtual string GetSettingsFilename()
    {
        return ApplicationName + ".config";
    }
 
    // Gets current executable path in order to determine where to read and write the config file
    public virtual string GetAppPath()
    {
        return new System.IO.FileInfo(System.Reflection.Assembly.GetExecutingAssembly().Location).DirectoryName;
    }
 
    // Retrieve settings from the configuration file
    public override SettingsPropertyValueCollection GetPropertyValues(SettingsContext sContext, SettingsPropertyCollection settingsColl)
    {
        // Create a collection of values to return
        SettingsPropertyValueCollection retValues = new SettingsPropertyValueCollection();
 
        // Create a temporary SettingsPropertyValue to reuse
        SettingsPropertyValue setVal;
 
        // Loop through the list of settings that the application has requested and add them
        // to our collection of return values.
        foreach (SettingsProperty sProp in settingsColl)
        {
            setVal = new SettingsPropertyValue(sProp);
            setVal.IsDirty = false;
            setVal.SerializedValue = GetSetting(sProp);
            retValues.Add(setVal);
        }
        return retValues;
    }
     
    // Save any of the applications settings that have changed (flagged as "dirty")
    public override void SetPropertyValues(SettingsContext sContext, SettingsPropertyValueCollection settingsColl)
    {
        // Set the values in XML
        foreach (SettingsPropertyValue spVal in settingsColl)
        {
            SetSetting(spVal);
        }
 
        // Write the XML file to disk
        try
        {
            XMLConfig.Save(System.IO.Path.Combine(GetAppPath(), GetSettingsFilename()));
        }
        catch (Exception ex)
        {
            // Create an informational message for the user if we cannot save the settings.
            // Enable whichever applies to your application type.
             
            // Uncomment the following line to enable a MessageBox for forms-based apps
            //System.Windows.Forms.MessageBox.Show(ex.Message, "Error writting configuration file to disk", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
 
            // Uncomment the following line to enable a console message for console-based apps
            //Console.WriteLine("Error writing configuration file to disk: " + ex.Message);
        }
    }
 
    private XmlDocument XMLConfig
    {
        get
        {
            // Check if we already have accessed the XML config file. If the xmlDoc object is empty, we have not.
            if (xmlDoc == null)
            {
                xmlDoc = new XmlDocument();
 
                // If we have not loaded the config, try reading the file from disk.
                try
                {
                    xmlDoc.Load(System.IO.Path.Combine(GetAppPath(), GetSettingsFilename()));
                }
 
                // If the file does not exist on disk, catch the exception then create the XML template for the file.
                catch (Exception)
                {
                    // XML Declaration
                    // <?xml version="1.0" encoding="utf-8"?>
                    XmlDeclaration dec = xmlDoc.CreateXmlDeclaration("1.0", "utf-8", null);
                    xmlDoc.AppendChild(dec);
 
                    // Create root node and append to the document
                    // <configuration>
                    XmlElement rootNode = xmlDoc.CreateElement(XMLROOT);
                    xmlDoc.AppendChild(rootNode);
 
                    // Create Configuration Sections node and add as the first node under the root
                    // <configSections>
                    XmlElement configNode = xmlDoc.CreateElement(CONFIGNODE);
                    xmlDoc.DocumentElement.PrependChild(configNode);
 
                    // Create the user settings section group declaration and append to the config node above
                    // <sectionGroup name="userSettings"...>
                    XmlElement groupNode = xmlDoc.CreateElement(GROUPNODE);
                    groupNode.SetAttribute("name", USERNODE);
                    groupNode.SetAttribute("type", "System.Configuration.UserSettingsGroup");
                    configNode.AppendChild(groupNode);
 
                    // Create the Application section declaration and append to the groupNode above
                    // <section name="AppName.Properties.Settings"...>
                    XmlElement newSection = xmlDoc.CreateElement("section");
                    newSection.SetAttribute("name", APPNODE);
                    newSection.SetAttribute("type", "System.Configuration.ClientSettingsSection");
                    groupNode.AppendChild(newSection);
 
                    // Create the userSettings node and append to the root node
                    // <userSettings>
                    XmlElement userNode = xmlDoc.CreateElement(USERNODE);
                    xmlDoc.DocumentElement.AppendChild(userNode);
 
                    // Create the Application settings node and append to the userNode above
                    // <AppName.Properties.Settings>
                    XmlElement appNode = xmlDoc.CreateElement(APPNODE);
                    userNode.AppendChild(appNode);
                }
            }
            return xmlDoc;
        }
    }
 
    // Retrieve values from the configuration file, or if the setting does not exist in the file,
    // retrieve the value from the application's default configuration
    private object GetSetting(SettingsProperty setProp)
    {
        object retVal;
        try
        {
            // Search for the specific settings node we are looking for in the configuration file.
            // If it exists, return the InnerText or InnerXML of its first child node, depending on the setting type.
 
            // If the setting is serialized as a string, return the text stored in the config
            if (setProp.SerializeAs.ToString() == "String")
            {
                return XMLConfig.SelectSingleNode("//setting[@name='" + setProp.Name + "']").FirstChild.InnerText;
            }
 
            // If the setting is stored as XML, deserialize it and return the proper object.  This only supports
            // StringCollections at the moment - I will likely add other types as I use them in applications.
            else
            {
                string settingType = setProp.PropertyType.ToString();
                string xmlData = XMLConfig.SelectSingleNode("//setting[@name='" + setProp.Name + "']").FirstChild.InnerXml;
                XmlSerializer xs = new XmlSerializer(typeof(string[]));
                string[] data = (string[])xs.Deserialize(new XmlTextReader(xmlData, XmlNodeType.Element, null));
 
                switch (settingType)
                {
                    case "System.Collections.Specialized.StringCollection":
                        StringCollection sc = new StringCollection();
                        sc.AddRange(data);
                        return sc;
                    default:
                        return "";
                }
            }
        }
        catch (Exception)
        {
            // Check to see if a default value is defined by the application.
            // If so, return that value, using the same rules for settings stored as Strings and XML as above
            if ((setProp.DefaultValue != null))
            {
                if (setProp.SerializeAs.ToString() == "String")
                {
                    retVal = setProp.DefaultValue.ToString();
                }
                else
                {
                    string settingType = setProp.PropertyType.ToString();
                    string xmlData = setProp.DefaultValue.ToString();
                    XmlSerializer xs = new XmlSerializer(typeof(string[]));
                    string[] data = (string[])xs.Deserialize(new XmlTextReader(xmlData, XmlNodeType.Element, null));
 
                    switch (settingType)
                    {
                        case "System.Collections.Specialized.StringCollection":
                            StringCollection sc = new StringCollection();
                            sc.AddRange(data);
                            return sc;
 
                        default: return "";
                    }
                }
            }
            else
            {
                retVal = "";
            }
        }
        return retVal;
    }
 
    private void SetSetting(SettingsPropertyValue setProp)
    {
        // Define the XML path under which we want to write our settings if they do not already exist
        XmlNode SettingNode = null;
 
        try
        {
            // Search for the specific settings node we want to update.
            // If it exists, return its first child node, (the <value>data here</value> node)
            SettingNode = XMLConfig.SelectSingleNode("//setting[@name='" + setProp.Name + "']").FirstChild;
        }
        catch (Exception)
        {
            SettingNode = null;
        }
 
        // If we have a pointer to an actual XML node, update the value stored there
        if ((SettingNode != null))
        {
            if (setProp.Property.SerializeAs.ToString() == "String")
            {
                SettingNode.InnerText = setProp.SerializedValue.ToString();
            }
            else
            {
                // Write the object to the config serialized as Xml - we must remove the Xml declaration when writing
                // the value, otherwise .Net's configuration system complains about the additional declaration.
                SettingNode.InnerXml = setProp.SerializedValue.ToString().Replace(@"<?xml version=""1.0"" encoding=""utf-16""?>", "");
            }
        }
        else
        {
            // If the value did not already exist in this settings file, create a new entry for this setting
 
            // Search for the application settings node (<Appname.Properties.Settings>) and store it.
            XmlNode tmpNode = XMLConfig.SelectSingleNode("//" + APPNODE);
 
            // Create a new settings node and assign its name as well as how it will be serialized
            XmlElement newSetting = xmlDoc.CreateElement("setting");
            newSetting.SetAttribute("name", setProp.Name);
             
            if (setProp.Property.SerializeAs.ToString() == "String")
            {
                newSetting.SetAttribute("serializeAs", "String");
            }
            else
            {
                newSetting.SetAttribute("serializeAs", "Xml");
            }
 
            // Append this node to the application settings node (<Appname.Properties.Settings>)
            tmpNode.AppendChild(newSetting);
 
            // Create an element under our named settings node, and assign it the value we are trying to save
            XmlElement valueElement = xmlDoc.CreateElement("value");
            if (setProp.Property.SerializeAs.ToString() == "String")
            {
                valueElement.InnerText = setProp.SerializedValue.ToString();
            }
            else
            {
                // Write the object to the config serialized as Xml - we must remove the Xml declaration when writing
                // the value, otherwise .Net's configuration system complains about the additional declaration
                valueElement.InnerXml = setProp.SerializedValue.ToString().Replace(@"<?xml version=""1.0"" encoding=""utf-16""?>", "");
            }           
 
            //Append this new element under the setting node we created above
            newSetting.AppendChild(valueElement);
        }
    }
}
{% endhighlight %}

#### Deserialization Bug
Immediately I found a bug during deserialization using [ArrayList](http://msdn.microsoft.com/en-us/library/system.collections.arraylist.aspx) or [StringCollection](http://msdn.microsoft.com/en-us/library/system.collections.specialized.stringcollection.aspx) within GetSetting(). It seems that the collection was being cast to a string array during deserialization. Luckily this is a simple fix:

{% highlight csharp %}
private object GetSetting(SettingsProperty setProp)
{
    object retVal;
     
    try
    {
        if (setProp.SerializeAs.ToString() == "String")
        {
            return XMLConfig.SelectSingleNode("//setting[@name='" + setProp.Name + "']").FirstChild.InnerText;
        }
 
        var xmlData = XMLConfig.SelectSingleNode(string.Format("//setting[@name='{0}']", setProp.Name)).FirstChild.InnerXml;
        return string.Format(@"{0}", xmlData);
    }
     
    catch (Exception)
    {
        if ((setProp.DefaultValue != null))
        {
            if (setProp.SerializeAs.ToString() == "String")
            {
                retVal = setProp.DefaultValue.ToString();
            }
            else
            {
                var settingType = setProp.PropertyType.ToString();
                var xmlData = setProp.DefaultValue.ToString();
                var xs = new XmlSerializer(typeof (string[]));
                var data = (string[]) xs.Deserialize(new XmlTextReader(xmlData, XmlNodeType.Element, null));
 
                switch (settingType)
                {
                    case "System.Collections.Specialized.StringCollection":
                        var sc = new StringCollection();
                        sc.AddRange(data);
                        return sc;
 
                    default:
                        return "";
                }
            }
        }
        else
        {
            retVal = "";
        }
    }
    return retVal;
}
{% endhighlight %}

#### Making it Reusable
Great, now it works perfectly. However, I'm far too lazy to copy this snippet into every project, I'd much prefer to reuse it from a referenced library. In order to do this, you'll have to make use of [GetEntryAssembly()](http://msdn.microsoft.com/en-us/library/system.reflection.assembly.getentryassembly.aspx). This will allow you to reference the portable settings class within any assembly.
Some words of caution: This solution is dependent on the calling assembly name. It will create a directory in the [ApplicationData](http://msdn.microsoft.com/en-us/library/system.environment.specialfolder.aspx) folder using the [Environment.GetFolderPath()](http://msdn.microsoft.com/en-us/library/system.environment.getfolderpath.aspx) method and then create the appropriate configuration file using the same name. Use it at your own risk and with common sense, especially if you plan on using this in any sort of production software.

Create a standard library (DLL) and add the following class:

{% highlight csharp %}
public class PortableSettingsProvider : SettingsProvider
{
    private const string XMLROOT = "configuration"; // XML Root node
    private const string CONFIGNODE = "configSections"; // Configuration declaration node     
    private const string GROUPNODE = "sectionGroup"; // Configuration section group declaration node
    private const string USERNODE = "userSettings"; // User section node
 
    // Application Specific Node
 
    private static string ConfigName;
    private static string ConfigDirectory;
    private string APPNODE;
 
    // Store instace of calling assembly
    private Assembly entryAssembly;
 
    private XmlDocument xmlDoc;
 
    public override string ApplicationName
    {
        get { return (entryAssembly.GetName().Name); }
        set { APPNODE = value; }
    }
 
    private XmlDocument XMLConfig
    {
        get
        {
            // Check if we already have accessed the XML config file. If the xmlDoc object is empty, we have not.
            if (xmlDoc == null)
            {
                xmlDoc = new XmlDocument();
 
                // If we have not loaded the config, try reading the file from disk.
                try
                {
                    xmlDoc.Load(Path.Combine(GetAppPath(), GetSettingsFilename()));
                }
 
                    // If the file does not exist on disk, catch the exception then create the XML template for the file.
                catch (Exception)
                {
                    // XML Declaration
                    // <?xml version="1.0" encoding="utf-8"?>
                    var dec = xmlDoc.CreateXmlDeclaration("1.0", "utf-8", null);
                    xmlDoc.AppendChild(dec);
 
                    // Create root node and append to the document
                    // <configuration>
                    var rootNode = xmlDoc.CreateElement(XMLROOT);
                    xmlDoc.AppendChild(rootNode);
 
                    // Create Configuration Sections node and add as the first node under the root
                    // <configSections>
                    var configNode = xmlDoc.CreateElement(CONFIGNODE);
                    xmlDoc.DocumentElement.PrependChild(configNode);
 
                    // Create the user settings section group declaration and append to the config node above
                    // <sectionGroup name="userSettings"...>
                    var groupNode = xmlDoc.CreateElement(GROUPNODE);
                    groupNode.SetAttribute("name", USERNODE);
                    groupNode.SetAttribute("type", "System.Configuration.UserSettingsGroup");
                    configNode.AppendChild(groupNode);
 
                    // Create the Application section declaration and append to the groupNode above
                    // <section name="AppName.Properties.Settings"...>
                    var newSection = xmlDoc.CreateElement("section");
                    newSection.SetAttribute("name", APPNODE);
                    newSection.SetAttribute("type", "System.Configuration.ClientSettingsSection");
                    groupNode.AppendChild(newSection);
 
                    // Create the userSettings node and append to the root node
                    // <userSettings>
                    var userNode = xmlDoc.CreateElement(USERNODE);
                    xmlDoc.DocumentElement.AppendChild(userNode);
 
                    // Create the Application settings node and append to the userNode above
                    // <AppName.Properties.Settings>
                    var appNode = xmlDoc.CreateElement(APPNODE);
                    userNode.AppendChild(appNode);
                }
            }
            return xmlDoc;
        }
    }
 
    // Override the Initialize method
    public override void Initialize(string name, NameValueCollection config)
    {
        entryAssembly = Assembly.GetEntryAssembly();
 
        ConfigName = entryAssembly.GetName().Name;
 
        ConfigDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), entryAssembly.GetName().Name);
 
        if (!(Directory.Exists(ConfigDirectory)))
        {
            Directory.CreateDirectory(ConfigDirectory);
        }
 
        APPNODE = ConfigName + ".Properties.Settings";
 
 
        base.Initialize(ApplicationName, config);
    }
 
    // Simply returns the name of the settings file, which is the solution name plus ".config"
    public virtual string GetSettingsFilename()
    {
        return string.Format("{0}.config", ApplicationName);
    }
 
    // Gets current executable path in order to determine where to read and write the config file
    public virtual string GetAppPath()
    {
        return ConfigDirectory;
        //return new FileInfo(callingAssembly.Location).DirectoryName;
    }
 
    // Override the ApplicationName property, returning the solution name.  No need to set anything, we just need to
    // retrieve information, though the set method still needs to be defined.
 
 
    // Retrieve settings from the configuration file
    public override SettingsPropertyValueCollection GetPropertyValues(SettingsContext sContext, SettingsPropertyCollection settingsColl)
    {
        // Create a collection of values to return
        var retValues = new SettingsPropertyValueCollection();
 
        // Create a temporary SettingsPropertyValue to reuse
 
        // Loop through the list of settings that the application has requested and add them
        // to our collection of return values.
        foreach (SettingsProperty sProp in settingsColl)
        {
            var setVal = new SettingsPropertyValue(sProp) {IsDirty = false, SerializedValue = GetSetting(sProp)};
            retValues.Add(setVal);
        }
        return retValues;
    }
 
    // Save any of the applications settings that have changed (flagged as "dirty")
    public override void SetPropertyValues(SettingsContext sContext, SettingsPropertyValueCollection settingsColl)
    {
        // Set the values in XML
        foreach (SettingsPropertyValue spVal in settingsColl)
        {
            SetSetting(spVal);
        }
 
        // Write the XML file to disk
        try
        {
            XMLConfig.Save(Path.Combine(GetAppPath(), GetSettingsFilename()));
        }
        catch (Exception ex)
        {
            // Create an informational message for the user if we cannot save the settings.
            // Enable whichever applies to your application type.
 
            // Uncomment the following line to enable a MessageBox for forms-based apps
            //MessageBox.Show(ex.Message, "Error writting configuration file to disk", MessageBoxButtons.OK, MessageBoxIcon.Error);
 
            // Uncomment the following line to enable a console message for console-based apps
            //Console.WriteLine("Error writing configuration file to disk: " + ex.Message);
        }
    }
 
    // Retrieve values from the configuration file, or if the setting does not exist in the file,
    // retrieve the value from the application's default configuration
    private object GetSetting(SettingsProperty setProp)
    {
        object retVal;
        try
        {
            // Search for the specific settings node we are looking for in the configuration file.
            // If it exists, return the InnerText or InnerXML of its first child node, depending on the setting type.
 
            // If the setting is serialized as a string, return the text stored in the config
            if (setProp.SerializeAs.ToString() == "String")
            {
                return XMLConfig.SelectSingleNode("//setting[@name='" + setProp.Name + "']").FirstChild.InnerText;
            }
 
            // This solves the problem with StringCollections throwing a NullReferenceException
            var xmlData = XMLConfig.SelectSingleNode(string.Format("//setting[@name='{0}']", setProp.Name)).FirstChild.InnerXml;
            return string.Format(@"{0}", xmlData);
        }
        catch (Exception)
        {
            // Check to see if a default value is defined by the application.
            // If so, return that value, using the same rules for settings stored as Strings and XML as above
            if ((setProp.DefaultValue != null))
            {
                if (setProp.SerializeAs.ToString() == "String")
                {
                    retVal = setProp.DefaultValue.ToString();
                }
                else
                {
                    var settingType = setProp.PropertyType.ToString();
                    var xmlData = setProp.DefaultValue.ToString();
                    var xs = new XmlSerializer(typeof (string[]));
                    var data = (string[]) xs.Deserialize(new XmlTextReader(xmlData, XmlNodeType.Element, null));
 
                    switch (settingType)
                    {
                        case "System.Collections.Specialized.StringCollection":
                            var sc = new StringCollection();
                            sc.AddRange(data);
                            return sc;
 
                        default:
                            return "";
                    }
                }
            }
            else
            {
                retVal = "";
            }
        }
        return retVal;
    }
 
    private void SetSetting(SettingsPropertyValue setProp)
    {
        // Define the XML path under which we want to write our settings if they do not already exist
        XmlNode SettingNode;
 
        try
        {
            // Search for the specific settings node we want to update.
            // If it exists, return its first child node, (the <value>data here</value> node)
            SettingNode = XMLConfig.SelectSingleNode(string.Format("//setting[@name='{0}']", setProp.Name)).FirstChild;
        }
        catch (Exception)
        {
            SettingNode = null;
        }
 
        // If we have a pointer to an actual XML node, update the value stored there
        if ((SettingNode != null))
        {
            if (setProp.Property.SerializeAs.ToString() == "String")
            {
                SettingNode.InnerText = setProp.SerializedValue.ToString();
            }
            else
            {
                // Write the object to the config serialized as Xml - we must remove the Xml declaration when writing
                // the value, otherwise .Net's configuration system complains about the additional declaration.
                SettingNode.InnerXml = setProp.SerializedValue.ToString().Replace(@"<?xml version=""1.0"" encoding=""utf-16""?>", "");
            }
        }
        else
        {
            // If the value did not already exist in this settings file, create a new entry for this setting
 
            // Search for the application settings node (<Appname.Properties.Settings>) and store it.
            var tmpNode = XMLConfig.SelectSingleNode(string.Format("//{0}", APPNODE)) ?? XMLConfig.SelectSingleNode(string.Format("//{0}.Properties.Settings", APPNODE));
 
            // Create a new settings node and assign its name as well as how it will be serialized
            var newSetting = xmlDoc.CreateElement("setting");
            newSetting.SetAttribute("name", setProp.Name);
            newSetting.SetAttribute("serializeAs", setProp.Property.SerializeAs.ToString() == "String" ? "String" : "Xml");
 
            // Append this node to the application settings node (<Appname.Properties.Settings>)
            tmpNode.AppendChild(newSetting);
 
            // Create an element under our named settings node, and assign it the value we are trying to save
            var valueElement = xmlDoc.CreateElement("value");
            if (setProp.Property.SerializeAs.ToString() == "String")
            {
                valueElement.InnerText = setProp.SerializedValue.ToString();
            }
            else
            {
                // Write the object to the config serialized as Xml - we must remove the Xml declaration when writing
                // the value, otherwise .Net's configuration system complains about the additional declaration
                valueElement.InnerXml = setProp.SerializedValue.ToString().Replace(@"<?xml version=""1.0"" encoding=""utf-16""?>", "");
            }
 
            //Append this new element under the setting node we created above
            newSetting.AppendChild(valueElement);
        }
    }
}
{% endhighlight %}

#### Assigning the ProviderBase

{% include post_image.liquid filename="vs-portable-settings.png" alt="Visual Studio Properties" title="Visual Studio Properties" %} 

Next, open your Visual Studio solution and go to the Settings tab located in the project properties for the appropriate project. For each of the settings that you want to make portable, modify the "Provider" property to represent the namespace scheme for your portable settings class. You will have to modify the provider property for each subsequent setting if you want it to remain portable. It can be a bit of a hassle, but in the end, it's a small cost for better control.

I have been using this code for a few years now on a few smaller projects with no problems. As I've stated, it's not perfect, but it's still an alright solution, assuming you use it properly.