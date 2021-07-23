# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 2.26"
    }
  }

backend "azurerm" {
    resource_group_name   = "tfstate"
    storage_account_name  = "tfstate28596"
    container_name        = "tfstate-server"
    key                   = "tf.tfstate"
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "warOfHeroesServer"
  location = "UK South"
}


resource "azurerm_app_service_plan" "app_service_plan" {
    name                = "warOfHeroesServer-appservice"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name

    sku {
        tier = "Shared"
        size = "D1"
    }
}

resource "azurerm_app_service" "frontend_app_service" {
    name                = "warOfHeroesServer"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    app_service_plan_id = azurerm_app_service_plan.app_service_plan.id
    https_only = true
    site_config {
        windows_fx_version = "DOTNETCORE|3.1"
        default_documents = ["main.js"]
        use_32_bit_worker_process = true
    }
}